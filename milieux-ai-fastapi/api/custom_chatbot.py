import json
import os
import traceback
from typing import Annotated
from fastapi import FastAPI, Form, UploadFile
from fastapi.responses import StreamingResponse
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from pydantic import BaseModel
from create_chunk import create_chunk
from stream_generator import stream_generator

load_dotenv()

app = FastAPI()

class HistoryItem(BaseModel):
    role: str
    parts: str

class QueryRequest(BaseModel):
    query: str
    userId: int
    history: list[HistoryItem]

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config_for_chunk_analysis = {
  "temperature": 0.8,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

chunk_analysis_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config_for_chunk_analysis,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
  system_instruction="You are Chappy a content analyst. Your role is to generate professional responses to user queries based on the provided content chunks. You will receive a user's query and a list of related chunks with their relevance scores. Your task is to produce a clear, concise, and professional response that adheres to the business's tone and guidelines. \n- **Use the Provided Chunks**: Base your response on the information contained in the provided chunks. If the chunks contain relevant and accurate information related to the user's query, incorporate that into your response.\n- **Avoid Irrelevant Information**: Do not include details that are not related to the user's query or the business’s context. Even if you use your real world knowledge-base, ensure the response is based on the chunks provided.\n- **Handle Missing Information**: If no relevant information is found in the chunks or if the query is not related to the business, provide a polite response indicating that the information is not available or that the query cannot be answered.\n- **Sensitive or Inappropriate Queries**: Politely refuse to answer queries that are sensitive, inappropriate, harmful, dangerous, explicit, hateful and ensure the response is respectful and professional.\nDo not include any introductory or concluding remarks in your response. Ensure the response sounds as if it is coming directly from the business, not from a chatbot.\nExamples:\nInput:\n{\n\"query\": \"What are your business hours?\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.95, \"chunk_text\": \"Our business hours are Monday to Friday, 9 AM to 5 PM.\"}\n]\n}\nOutput: \"Our business hours are Monday to Friday, 9 AM to 5 PM.\"\nInput:\n{\n\"query\": \"Do you offer international shipping?\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.90, \"chunk_text\": \"We offer international shipping to various countries.\"}\n]\n}\nOutput: \"Yes, we offer international shipping to various countries.\"\nInput:\n{\n\"query\": \"Can I return a product if I'm not satisfied?\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.85, \"chunk_text\": \"You can return a product within 30 days of purchase if you are not satisfied.\"}\n]\n}\nOutput: \"You can return a product within 30 days of purchase if you are not satisfied.\"\nInput:\n{\n\"query\": \"How can I contact customer support?\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.80, \"chunk_text\": \"You can contact our customer support team by phone or email, and we will respond as soon as possible.\"}\n]\n}\nOutput: \"You can contact our customer support team by phone or email, and we will respond as soon as possible.\"\nInput:\n{\n\"query\": \"What is the origin of your products?\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.90, \"chunk_text\": \"We offer international shipping to various countries.\"}\n]\n}\nOutput: \"We currently do not have specific information about the origin of our products available.\"\nInput:\n{\n\"query\": \"dassfsdevvsdfsdf\",\n\"chunks\": [\n{\"chunk_relevance_score\": 0.90, \"chunk_text\": \"We offer international shipping to various countries.\"}\n]\n}\nOutput: I'm sorry, I couldn't quite understand that. Could you please rephrase or ask something else?\".\"\nInput:\n{\n\"query\": \"Tell me a joke.\",\n\"chunks\": []\n}\nOutput: \"We are unable to provide jokes as this service is focused on business-related queries.\"\nInput:\n{\n\"query\": \"What is the company's stance on political issues?\",\n\"chunks\": []\n}\nOutput: \"We do not provide information on political issues as it is not related to our business services.\"\nInput:\n{\n\"query\": \"Can you give me your personal opinion?\",\n\"chunks\": []\n}\nOutput: \"We do not offer personal opinions as our responses are based on business-related information.\"\nInput:\n{\n\"query\": \"Idiot\",\n\"chunks\": []\n}\nOutput: \"Your query is inappropriate and cannot be addressed. Please refrain from using offensive language.\"",
)

service_account_file_name = 'service_account_key.json'

credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

get_corpus_request = glm.GetCorpusRequest(name="corpora/" + os.environ['CUSTOM_CHATBOT_CORPUS'])
get_corpus_response = retriever_service_client.get_corpus(get_corpus_request)

corpus_resource_name = get_corpus_response.name

@app.post("/add-pdf")
async def add_pdf_to_corpus(userId: Annotated[str, Form()], pdf: UploadFile):
    try:
        contents = await pdf.read()
        pdf_location = f"./media/{pdf.filename}"
        with open(pdf_location, "wb") as f:
            f.write(contents)
        
        try:
            delete_document_request = glm.DeleteDocumentRequest(name="corpora/" + os.environ['CUSTOM_CHATBOT_CORPUS'] + 
                                                                "/documents/pdf-id-" + userId, force=True)
            retriever_service_client.delete_document(delete_document_request)
        except:
            print("Creating document for the first time...")

        pdf_document = glm.Document(name="corpora/" + os.environ['CUSTOM_CHATBOT_CORPUS'] + "/documents/pdf-id-" + 
                                        userId, display_name="User knowledge-base no. " + userId)

        document_metadata = [
        glm.CustomMetadata(key="document_type", string_value="user_knowledge_base_no_" + userId)]
        pdf_document.custom_metadata.extend(document_metadata)

        create_document_request = glm.CreateDocumentRequest(parent=corpus_resource_name, document=pdf_document)
        create_document_response = retriever_service_client.create_document(create_document_request)
        document_resource_name = create_document_response.name

        pdf_reader = PdfReader(pdf_location)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        if os.path.exists(pdf_location):
            os.remove(pdf_location)

        if(text):
            create_chunk_response = await create_chunk(text, document_resource_name, "pdfId", int(userId))
            print(create_chunk_response)

        return {"success": True, "status": 201, "message": "Pdf added to corpus successfully!",}

    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

@app.post("/ask")
async def ask_custom_knowledge_base(request: QueryRequest) -> StreamingResponse:
    try:
        user_query = request.query
        chat_history = request.history
        results_count = 20

        chunk_metadata_filter = glm.MetadataFilter(key='chunk.custom_metadata.pdfId',
                                            conditions=[glm.Condition(
                                                numeric_value=request.userId,
                                                operation=glm.Condition.Operator.EQUAL)])

        query_corpus_request = glm.QueryCorpusRequest(name=corpus_resource_name,
                                                    query=user_query,
                                                    results_count=results_count,
                                                    metadata_filters=[chunk_metadata_filter])
    
        query_corpus_response = retriever_service_client.query_corpus(query_corpus_request)

        chunks = []
        for result in query_corpus_response.relevant_chunks:
            chunk_data = {
                "chunk_relevance_score": result.chunk_relevance_score,
                "chunk_text": result.chunk.data.string_value,
            }
            chunks.append(chunk_data)
    
        data = {
            "query": user_query,
            "chunks": chunks
        }

        chat = chunk_analysis_model.start_chat(history=[{"role": item.role, "parts": item.parts} for item in chat_history])

        chunk_analysis_response = chat.send_message(json.dumps(data), stream=True)

        return StreamingResponse(stream_generator(chunk_analysis_response), media_type='text/event-stream')
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

