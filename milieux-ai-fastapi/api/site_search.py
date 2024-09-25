import os
import json
import time
import traceback
from typing import Optional
from urllib.parse import urlparse
from fastapi import APIRouter
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv
from pydantic import BaseModel
from utils.create_chunk import create_chunk
from utils.download_media import download_media

load_dotenv()

router = APIRouter()

class AddPostRequest(BaseModel):
    text: str
    postId: int
    media_url: Optional[str] = None

class SearchRequest(BaseModel):
    query: str

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config_for_media_analysis = {
  "temperature": 0.25,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 200,
  "response_mime_type": "text/plain",
}

generation_config_for_chunk_analysis = {
  "temperature": 0.25,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 200,
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
system_instruction="As a content analyst, your role is to analyze the provided media content (photo or video) and generate a detailed, descriptive narrative that captures the main features, context, and significance of the media. Focus on the most relevant elements, including prominent objects, significant activities, key locations, and any relevant historical, cultural, or background information. Consider the tone and intent behind the media to provide a description that is both informative and contextually rich. Avoid mentioning common or incidental elements that are not central to the media's content. The response should be detailed enough for various content-related purposes, including feeding into a vector database. Do not include any introductory or concluding remarks. If no relevant details can be extracted, return \"null.\"\nExamples:\n1. **Input**: Photo of the Colosseum in Rome, Italy.\n **Output**: The Colosseum, an ancient amphitheater located in the heart of Rome, Italy, is captured in this image. Built during the first century AD, the Colosseum is an iconic symbol of the Roman Empire's grandeur and architectural prowess. The stone arches and partially ruined structure reflect its historical significance as a venue for gladiatorial contests and public spectacles.\n2. **Input**: Photo of a mountain landscape with a river and forest.\n **Output**: A serene mountain landscape dominated by towering, snow-capped peaks. A river winds through the dense forest of pine trees, reflecting the surrounding natural beauty. The rocky terrain and untouched wilderness suggest a remote, pristine environment.\n3. **Input**: Video of a soccer game in a stadium with cheering fans.\n **Output**: An intense soccer match played in a large, crowded stadium. The players, dressed in brightly colored uniforms, are engaged in fast-paced action as they compete for the ball. The roaring crowd of fans waves banners and cheers enthusiastically, creating an electrifying atmosphere. The well-maintained grass field and stadium lights highlight the importance of the event.\n4. **Input**: Blurry photo with no discernible features.\n **Output**: null\n5. **Input**: Video of the Great Wall of China during sunrise.\n **Output**: A breathtaking view of the Great Wall of China, winding across the mountainous terrain as the first light of dawn breaks over the horizon. The Wall, originally built to protect Chinese states from invasions, stands as a testament to the engineering feats of ancient civilizations. The warm hues of the sunrise bathe the Wall in a golden light, highlighting its length and the rugged beauty of the surrounding landscape.\n6. **Input**: Photo of a group of people holding a protest march with banners.\n **Output**: A dynamic image of a protest march, where a diverse group of people hold banners and signs advocating for social justice. The determined expressions on the faces of the protesters reflect the urgency and passion behind their cause. The background shows an urban setting, with buildings and streets filled with demonstrators, underscoring the widespread nature of the movement.\n7. **Input**: Video of a traditional Japanese tea ceremony.\n **Output**: A serene depiction of a traditional Japanese tea ceremony, where a tea master prepares matcha tea with precise, graceful movements. The ceremony takes place in a tatami-matted room, surrounded by elements of nature, including bonsai trees and a tranquil garden visible through sliding shoji doors. This ritual, steeped in Zen Buddhism, emphasizes mindfulness, respect, and the beauty of simplicity.\n8. **Input**: Video of a medieval castle on a hilltop.\n **Output**: A majestic view of a medieval castle perched atop a hill, overlooking a vast, green valley below. The stone fortress, complete with towering battlements and a drawbridge, evokes the turbulent history of the Middle Ages, where such castles served as both homes for nobility and defensive strongholds. The surrounding landscape adds to the castle's aura of strength and isolation.\n9. **Input**: Photo of Luffy from One Piece anime.\n **Output**: A vibrant image of Monkey D. Luffy, the protagonist from the popular One Piece anime. Luffy is depicted in his iconic straw hat and red vest, with a determined expression on his face. The background includes elements from the anime's world, such as the open sea and pirate ships, underscoring Luffy's adventurous spirit and his quest to find the One Piece treasure.",
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
  system_instruction="Analyze the provided chunks of post data and filter them out based on their relevance to the user's query. Return the postId of only and only the relevant chunks to the query in descending order of relevance, prioritizing the chunks that are most related to the query. Never include the postId of irrelevant post data chunks at all. If no chunks are relevant, return an empty JSON array. The output should strictly follow this JSON schema:\n{\"postIds\": [list of postIds]}\nExamples:\nInput:\n{\n  \"query\": \"best places to visit in Indonesia\",\n  \"chunks\": [\n    {\n      \"chunk_relevance_score\": 0.95,\n      \"chunk_text\": \"Bali is a popular tourist destination in Indonesia known for its beaches.\",\n      \"custom_metadata\": {\"postId\": 1}\n    },\n    {\n      \"chunk_relevance_score\": 0.60,\n      \"chunk_text\": \"Jakarta is the capital city of Indonesia.\",\n      \"custom_metadata\": {\"postId\": 2}\n    },\n    {\n      \"chunk_relevance_score\": 0.80,\n      \"chunk_text\": \"Komodo National Park is famous for its Komodo dragons.\",\n      \"custom_metadata\": {\"postId\": 3}\n    },\n    {\n      \"chunk_relevance_score\": 0.40,\n      \"chunk_text\": \"Indonesia is an archipelago with over 17,000 islands.\",\n      \"custom_metadata\": {\"postId\": 4}\n    }\n  ]\n}\nOutput:\n{\n  \"postIds\": [1, 3, 2]\n}\nInput:\n{\n  \"query\": \"famous landmarks in Japan\",\n  \"chunks\": [\n    {\n      \"chunk_relevance_score\": 0.85,\n      \"chunk_text\": \"Mount Fuji is Japan's tallest peak and an iconic symbol of the country.\",\n      \"custom_metadata\": {\"postId\": 10}\n    },\n    {\n      \"chunk_relevance_score\": 0.55,\n      \"chunk_text\": \"Tokyo Tower is a famous observation and communication tower located in the capital.\",\n      \"custom_metadata\": {\"postId\": 11}\n    },\n    {\n      \"chunk_relevance_score\": 0.25,\n      \"chunk_text\": \"Tokyo is the most populous city in Japan.\",\n      \"custom_metadata\": {\"postId\": 12}\n    }\n  ]\n}\nOutput:\n{\n  \"postIds\": [10, 11]\n}\nInput:\n{\n  \"query\": \"types of coffee beans\",\n  \"chunks\": [\n    {\n      \"chunk_relevance_score\": 0.75,\n      \"chunk_text\": \"Arabica beans are the most popular and widely consumed coffee beans globally.\",\n      \"custom_metadata\": {\"postId\": 21}\n    },\n    {\n      \"chunk_relevance_score\": 0.90,\n      \"chunk_text\": \"Robusta beans are known for their strong and bitter flavor, often used in instant coffee.\",\n      \"custom_metadata\": {\"postId\": 22}\n    },\n    {\n      \"chunk_relevance_score\": 0.20,\n      \"chunk_text\": \"Coffee has been consumed for centuries and is now a major global commodity.\",\n      \"custom_metadata\": {\"postId\": 23}\n    }\n  ]\n}\nOutput:\n{\n  \"postIds\": [22, 21]\n}\nInput:\n{\n  \"query\": \"ancient Greek philosophers\",\n  \"chunks\": [\n    {\n      \"chunk_relevance_score\": 0.88,\n      \"chunk_text\": \"Socrates was one of the founders of Western philosophy.\",\n      \"custom_metadata\": {\"postId\": 31}\n    },\n    {\n      \"chunk_relevance_score\": 0.75,\n      \"chunk_text\": \"Plato was a student of Socrates and wrote extensively on philosophy and politics.\",\n      \"custom_metadata\": {\"postId\": 32}\n    },\n    {\n      \"chunk_relevance_score\": 0.92,\n      \"chunk_text\": \"Aristotle, a student of Plato, made significant contributions to various fields of knowledge.\",\n      \"custom_metadata\": {\"postId\": 33}\n    }\n  ]\n}\nOutput:\n{\n  \"postIds\": [33, 31, 32]\n}\nInput (No relevant chunks):\n{\n  \"query\": \"modern web development trends\",\n  \"chunks\": [\n    {\n      \"chunk_relevance_score\": 0.10,\n      \"chunk_text\": \"The Industrial Revolution marked a significant turning point in human history.\",\n      \"custom_metadata\": {\"postId\": 41}\n    },\n    {\n      \"chunk_relevance_score\": 0.05,\n      \"chunk_text\": \"The French Revolution was a period of radical social and political change in France.\",\n      \"custom_metadata\": {\"postId\": 42}\n    }\n  ]\n}\nOutput:\n{\n  \"postIds\": []\n}\n",
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

        start_time = time.time()
        timeout = 10
        while file.state.name == "PROCESSING":
            if time.time() - start_time > timeout:
                break
            time.sleep(0.1)

        if file.state.name == "FAILED":
            raise ValueError(file.state.name)

        response = media_analysis_model.generate_content(file)
        genai.delete_file(file)
        
        if response.candidates[0].finish_reason == 1:
            return response.text
        else:
            return ""

@router.post("/add-post")
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
                                     str(request.postId), display_name="Social media post no. " + str(request.postId))

        document_metadata = [
        glm.CustomMetadata(key="document_type", string_value="social_media_post_no_" + str(request.postId))]
        post_document.custom_metadata.extend(document_metadata)

        create_document_request = glm.CreateDocumentRequest(parent=corpus_resource_name, document=post_document)
        create_document_response = retriever_service_client.create_document(create_document_request)
        document_resource_name = create_document_response.name

        if(request.text):
            create_chunk_response = await create_chunk(request.text, document_resource_name, "postId", request.postId )
            print(create_chunk_response)

        if(media_analysis_text):
            create_chunk_response = await create_chunk(media_analysis_text, document_resource_name, "postId", request.postId )
            print(create_chunk_response)

        return {"success": True, "status": 201, "message": "Post added to corpus successfully!",}

    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

@router.post("/search")
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

