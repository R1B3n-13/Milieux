import os
import json
import traceback
from typing import Optional
from urllib.parse import urlparse
from fastapi import FastAPI
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv
from pydantic import BaseModel
from create_chunk import create_chunk
from download_media import download_media

load_dotenv()

app = FastAPI()

class AddPostRequest(BaseModel):
    text: str
    postId: int
    media_url: Optional[str] = None

class SearchRequest(BaseModel):
    query: str

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config_for_media_analysis = {
  "temperature": 0.1,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

generation_config_for_chunk_analysis = {
  "temperature": 0.1,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

media_analysis_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config_for_media_analysis,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
system_instruction="As a content analyst, analyze the provided media content (photo or video) and generate a description that focuses on the main features of the media. Include only the most relevant details such as prominent objects, significant activities, key locations and any relevant contextual information (e.g., well-known characters, cultural references etc.). Avoid mentioning common elements that are not central to the media's content. The response should be concise and structured to facilitate feeding into a vector database. Do not include any introductory or concluding remarks. If no relevant details can be extracted, return \"null\".\nExamples:\nInput: Photo of a beach with palm trees and people swimming.\nOutput: Beach, palm trees, people swimming, ocean, sand\nInput: Video of a city street with cars, bicycles, and pedestrians.\nOutput: City street, cars, bicycles, pedestrians, buildings\nInput: Photo of a mountain landscape with a river and forest.\nOutput: Mountain, river, forest, trees, rocky terrain\nInput: Video of a soccer game in a stadium with cheering fans.\nOutput: Soccer game, stadium, players, ball, goalposts, fans, grass field\nInput: Blurry photo with no discernible features.\nOutput: null\nInput: Video of a sunset over a lake with birds flying.\nOutput: Sunset, lake, birds flying, water reflection\nInput: Photo of Luffy from One Piece anime.\nOutput: Monkey D. Luffy, anime character, one piece anime",
)

chunk_analysis_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config_for_chunk_analysis,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
  system_instruction="Analyze the provided chunks of data and filter them based on their relevance to the user's query. Return the postId of the chunks that are most relevant to the query in JSON format. If no chunks are relevant, return an empty JSON array. Use this JSON schema:\n int postId;\nReturn {\"postIds:\"list[PostId]}\nExamples:\nInput:\n\"query\": \"best places to visit in Indonesia\",\n\"chunks\": [\n{\n\"chunk_relevance_score\": 0.95,\n\"chunk_text\": \"Bali is a popular tourist destination in Indonesia known for its beaches.\",\n\"custom_metadata\": {\"postId\": 1}\n},\n{\n\"chunk_relevance_score\": 0.60\n\"chunk_text\": \"Jakarta is the capital city of Indonesia.\",\n\"custom_metadata\": {\"postId\": 2}\n},\n{\n\"chunk_relevance_score\": 0.80,\n\"chunk_text\": \"Komodo National Park is famous for its Komodo dragons.\",\n\"custom_metadata\": {\"postId\": 3}\n},\n{\n\"chunk_relevance_score\": 0.40,\n\"chunk_text\": \"Indonesia is an archipelago with over 17,000 islands.\",\n\"custom_metadata\": {\"postId\": 4}\n}\n]\nOutput: {\"postIds:\"[1, 2, 3]}",
)

service_account_file_name = 'service_account_key.json'

credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

get_corpus_request = glm.GetCorpusRequest(name="corpora/" + os.environ['SITE_SEARCH_CORPUS'])
get_corpus_response = retriever_service_client.get_corpus(get_corpus_request)

corpus_resource_name = get_corpus_response.name

async def generate_media_analysis_response(media_path: str):
    if(media_path):
        file = genai.upload_file(path=media_path)
        response = media_analysis_model.generate_content(file)
        genai.delete_file(file)
        if response.candidates[0].finish_reason == 1:
            return response.text
        else:
            return ""

@app.post("/add-post")
async def add_post_to_corpus(request: AddPostRequest):
    try:
        media_path = ""
        media_analysis_text = ""

        if request.media_url:
            parsed_url = urlparse(request.media_url)
            filename = os.path.basename(parsed_url.path)
            media_path = os.path.join("media", filename)
            os.makedirs(os.path.dirname(media_path), exist_ok=True)
            await download_media(request.media_url, media_path)
    
        media_analysis_text = await generate_media_analysis_response(media_path)

        if os.path.exists(media_path):
            os.remove(media_path)

        post_document = glm.Document(name="corpora/" + os.environ['SITE_SEARCH_CORPUS'] + "/documents/post-id-" + 
                                     str(request.postId), display_name="Social media post no." + str(request.postId))

        document_metadata = [
        glm.CustomMetadata(key="document_type", string_value="social_media_post_no_" + str(request.postId))]
        post_document.custom_metadata.extend(document_metadata)

        create_document_request = glm.CreateDocumentRequest(parent=corpus_resource_name, document=post_document)
        create_document_response = retriever_service_client.create_document(create_document_request)
        document_resource_name = create_document_response.name

        if(request.text):
            create_chunk_response = await create_chunk(request.text, document_resource_name, request.postId )
            print(create_chunk_response)

        if(media_analysis_text):
            create_chunk_response = await create_chunk(media_analysis_text, document_resource_name, request.postId )
            print(create_chunk_response)

        return {"success": True, "status": 201, "message": "Post added to corpus successfully!",}

    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

@app.post("/search")
async def search_by_user_query(request: SearchRequest):
    try:
        user_query = request.query
        results_count = 20

        query_corpus_request = glm.QueryCorpusRequest(name=corpus_resource_name,
                                                  query=user_query,
                                                  results_count=results_count)
    
        query_corpus_response = retriever_service_client.query_corpus(query_corpus_request)

        chunks = []
        for result in query_corpus_response.relevant_chunks:
            chunk_data = {
                "chunk_relevance_score": result.chunk_relevance_score,
                "chunk_text": result.chunk.data.string_value,
                "custom_metadata": {meta.key: meta.numeric_value for meta in result.chunk.custom_metadata},
            }
            chunks.append(chunk_data)
    
        data = {
            "query": user_query,
            "chunks": chunks
        }

        chunk_analysis_response = chunk_analysis_model.generate_content(json.dumps(data))

        return {"success": True, "status": 200, "message": "Query successful!", "result": chunk_analysis_response.text}
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

