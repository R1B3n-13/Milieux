import base64
import importlib
import json
import os
import tempfile
import traceback
from typing import Annotated, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from PyPDF2 import PdfReader
from dotenv import load_dotenv
from pydantic import BaseModel
from utils.create_chunk import create_chunk
from utils.stream_generator import stream_generator

load_dotenv()

router = APIRouter()

class HistoryItem(BaseModel):
    role: str
    parts: str

class QueryRequest(BaseModel):
    query: str
    userId: int
    history: list[HistoryItem]
    temperature: float
    top_p: float
    top_k: int
    system_instruction: str
    temperature_tool: Optional[float] = None
    top_p_tool: Optional[float] = None
    top_k_tool: Optional[int] = None
    system_instruction_tool: Optional[str] = None

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config_for_chunk_analysis = {
    "temperature": 0.80,
    "top_p": 0.80,
    "top_k": 60,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

generation_config_for_func_calling = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
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
    system_instruction=  'You are Chappy, a content analyst. Your role is to generate professional responses to user queries based on the provided content chunks. You will receive a user\'s query and a list of related chunks with their relevance scores. Your task is to produce a clear, concise, and professional response that adheres to the business\'s tone and guidelines.\n\nUse the Provided Chunks: Base your response on the information contained in the provided chunks. If the chunks contain relevant and accurate information related to the user\'s query, incorporate that into your response.\n\nAvoid Irrelevant Information: Do not include details that are not related to the user\'s query or the business’s context. Even if you use your real world knowledge-base, ensure the response is based on the chunks provided.\n\nHandle Missing Information: If no relevant information is found in the chunks or if the query is not related to the business, provide a polite response indicating that the information is not available or that the query cannot be answered.\n\nSensitive or Inappropriate Queries: Politely refuse to answer queries that are sensitive, inappropriate, harmful, dangerous, explicit, hateful and ensure the response is respectful and professional.\n\nDo not include any introductory or concluding remarks in your response. Ensure the response sounds as if it is coming directly from the business, not from a chatbot.\n\nExamples:\n\nInput:\n{\n  "query": "What are your business hours?",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.95,\n      "chunk_text": "Our business hours are Monday to Friday, 9 AM to 5 PM."\n    }\n  ]\n}\n\nOutput: "Our business hours are Monday to Friday, 9 AM to 5 PM."\n\nInput:\n{\n  "query": "Do you offer international shipping?",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.90,\n      "chunk_text": "We offer international shipping to various countries."\n    }\n  ]\n}\n\nOutput: "Yes, we offer international shipping to various countries."\n\nInput:\n{\n  "query": "Can I return a product if I\'m not satisfied?",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.85,\n      "chunk_text": "You can return a product within 30 days of purchase if you are not satisfied."\n    }\n  ]\n}\n\nOutput: "You can return a product within 30 days of purchase if you are not satisfied."\n\nInput:\n{\n  "query": "How can I contact customer support?",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.80,\n      "chunk_text": "You can contact our customer support team by phone or email, and we will respond as soon as possible."\n    }\n  ]\n}\n\nOutput: "You can contact our customer support team by phone or email, and we will respond as soon as possible."\n\nInput:\n{\n  "query": "What is the origin of your products?",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.90,\n      "chunk_text": "We offer international shipping to various countries."\n    }\n  ]\n}\n\nOutput: "We currently do not have specific information about the origin of our products available."\n\nInput:\n{\n  "query": "dassfsdevvsdfsdf",\n  "chunks": [\n    {\n      "chunk_relevance_score": 0.90,\n      "chunk_text": "We offer international shipping to various countries."\n    }\n  ]\n}\n\nOutput: "I\'m sorry, I couldn\'t quite understand that. Could you please rephrase or ask something else?"\n\nInput:\n{\n  "query": "Tell me a joke.",\n  "chunks": []\n}\n\nOutput: "We are unable to provide jokes as this service is focused on business-related queries."\n\nInput:\n{\n  "query": "What is the company\'s stance on political issues?",\n  "chunks": []\n}\n\nOutput: "We do not provide information on political issues as it is not related to our business services."\n\nInput:\n{\n  "query": "Can you give me your personal opinion?",\n  "chunks": []\n}\n\nOutput: "We do not offer personal opinions as our responses are based on business-related information."\n\nInput:\n{\n  "query": "Idiot",\n  "chunks": []\n}\n\nOutput: "Your query is inappropriate and cannot be addressed. Please refrain from using offensive language."'
)

func_calling_model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config_for_func_calling,
    safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
    system_instruction=  'You are a helpful assistant. You can process user queries and sometimes call functions when necessary.'
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

@router.post("/add-pdf")
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
    

async def parse_request_data(request: str = Form(...)):
    return QueryRequest.parse_raw(request)

@router.post("/ask")
async def ask_custom_knowledge_base(request: QueryRequest = Depends(parse_request_data),
                                    tool_file: Optional[UploadFile] = File(None)) -> StreamingResponse:
    try:
        if(tool_file):
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp_file:
                    file_location = temp_file.name
                    content = await tool_file.read()
                    decoded_content = base64.b64decode(content)
                    temp_file.write(decoded_content)

                module_name = os.path.basename(file_location).replace(".py", "")
                spec = importlib.util.spec_from_file_location(module_name, file_location)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
        
                if not hasattr(module, 'functions') or not hasattr(module, 'schemas'):
                    raise HTTPException(status_code=400, detail="The uploaded file must define 'functions' and 'schemas'.")
        
                functions = getattr(module, 'functions')
                schemas = getattr(module, 'schemas')

                func_calling_model._tools = schemas

                if request.temperature_tool:
                    func_calling_model._generation_config["temperature"] = request.temperature_tool
                if request.top_p_tool:
                    func_calling_model._generation_config["top_p"] = request.top_p_tool
                if request.top_k_tool:
                    func_calling_model._generation_config["top_k"] = request.top_k_tool
                if request.system_instruction_tool:
                    func_calling_model._system_instruction.parts[0].text = request.system_instruction_tool

                chat = func_calling_model.start_chat(history=[{"role": item.role, "parts": item.parts} for item in request.history])

                func_calling_response = chat.send_message(request.query)

                function_called = False
                simulated_responses = {}

                for part in func_calling_response.parts:
                    if fn := part.function_call:
                        function_name = fn.name 
                        args = fn.args
                        if function_name in functions:
                            function_called = True
                            result = functions[function_name](**args)
                            simulated_responses[function_name] = result

                if function_called:
                    response_parts = [
                        genai.protos.Part(
                                function_response=genai.protos.FunctionResponse(name=fn, response=result)
                        )
                        for fn, result in simulated_responses.items()
                    ]

                    continued_response = chat.send_message(response_parts, stream=True)

                    return StreamingResponse(stream_generator(continued_response), media_type='text/event-stream')
    
            except Exception as e:
                print(f"Function call resulted in error: {e}")

            finally:
                if os.path.exists(file_location):
                    os.remove(file_location)            

        chunk_analysis_model._generation_config["temperature"] = request.temperature
        chunk_analysis_model._generation_config["top_p"] = request.top_p
        chunk_analysis_model._generation_config["top_k"] = request.top_k
        chunk_analysis_model._system_instruction.parts[0].text = request.system_instruction

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
        raise HTTPException(status_code=500, detail="Internal server error")

