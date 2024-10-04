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
from google.generativeai.types import HarmCategory, HarmBlockThreshold, File
from dotenv import load_dotenv
from pydantic import BaseModel
from utils.download_media import download_media

load_dotenv()

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    image_url: str

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
  system_instruction="Analyze the user's query and the provided image to determine if the user is asking for posts explicitly about the subject in the image or for posts that match the type or category suggested by the image. If the query asks for posts about specific subject, return only posts explicitly referencing the subject depicted in the image. If the query asks for posts based on a category/type, use the image as guidance to return posts relevant to that category or type. In both cases, return only the postId of relevant chunks. If no relevant chunks are found, return an empty JSON array. The output must strictly follow this schema: {\"postIds\": [list of postIds]}.\nExamples:\nInput:\n\"image\": \"image of the Eiffel Tower\",\n{ \"query\": \"find me posts about this landmark\",\n\"chunks\": [ { \"chunk_relevance_score\": 0.85,\n\"chunk_text\": \"The Eiffel Tower is one of the most recognizable landmarks in Paris.\",\n\"custom_metadata\": {\"postId\": 5}\n}, { \"chunk_relevance_score\": 0.40,\n\"chunk_text\": \"The Louvre Museum is a famous art museum in Paris.\",\n\"custom_metadata\": {\"postId\": 6}\n} ]\n}\nOutput:\n{ \"postIds\": [5]\n}\nExplanation: The user is asking for posts about the specific landmark shown in the image (the Eiffel Tower). The Louvre is not relevant.\nInput:\n\"image\": \"image of a Persian cat\",\n{ \"query\": \"find me posts about this category of pets\",\n\"chunks\": [ { \"chunk_relevance_score\": 0.75,\n\"chunk_text\": \"Persian cats are known for their long fur and calm demeanor.\",\n\"custom_metadata\": {\"postId\": 22}\n}, { \"chunk_relevance_score\": 0.65,\n\"chunk_text\": \"Labrador retrievers are among the most popular dog breeds in the world.\",\n\"custom_metadata\": {\"postId\": 23}\n} ]\n}\nOutput:\n{ \"postIds\": [22]\n}\nExplanation: The query is asking for a specific category (cats), so the relevant post about Persian cats is returned, while the post about dogs is excluded.\nInput:\n\"image\": \"image of someone skiing\",\n{ \"query\": \"show me posts about similar kind of fun activities\",\n\"chunks\": [ { \"chunk_relevance_score\": 0.80,\n\"chunk_text\": \"This post discusses the best skiing destinations in Europe.\",\n\"custom_metadata\": {\"postId\": 31}\n}, { \"chunk_relevance_score\": 0.55,\n\"chunk_text\": \"This post covers scuba diving spots around the world.\",\n\"custom_metadata\": {\"postId\": 32}\n} ]\n}\nOutput:\n{ \"postIds\": [31, 32]\n}\nExplanation: The image suggests a fun activity (skiing) and the query is about similar types of activities, so both the activities (skiing, scuba diving) are relevant.\nInput:\n\"image\": \"image of the Great Wall of China\",\n{ \"query\": \"show me posts about similar types of historical site\",\n\"chunks\": [ { \"chunk_relevance_score\": 0.85,\n\"chunk_text\": \"The Great Wall of China is one of the most famous landmarks in the world.\",\n\"custom_metadata\": {\"postId\": 40}\n}, { \"chunk_relevance_score\": 0.60,\n\"chunk_text\": \"The Taj Mahal is a symbol of India's rich history and architectural beauty.\",\n\"custom_metadata\": {\"postId\": 41}\n} ]\n}\nOutput:\n{ \"postIds\": [40, 41]\n}\nExplanation: The query asks for posts about similar types of historical site shown in the image (the Great Wall of China), so both of the posts are relevant.\nInput:\n\"image\": \"image of the Statue of Liberty\",\n{\n  \"query\": \"find me posts about this place\",\n  \"chunks\": [\n  {\n  \"chunk_relevance_score\": 0.40,\n  \"chunk_text\": \"The Empire State Building is a famous skyscraper in New York City.\",\n  \"custom_metadata\": {\"postId\": 40}\n },\n {\n  \"chunk_relevance_score\": 0.50,\n   \"chunk_text\": \"Central Park is a large public park in Manhattan, New York.\",\n  \"custom_metadata\": {\"postId\": 41}\n  }\n  ]\n}\nOutput:\n{\n  \"postIds\": []\n}\nExplanation: The user provided an image of the Statue of Liberty and asked about that specific place, but none of the chunks mention it. Therefore, you should return an empty array.",
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

async def generate_image_analysis_response(file: File):
        start_time = time.time()
        timeout = 10
        while file.state.name == "PROCESSING":
            if time.time() - start_time > timeout:
                break
            time.sleep(0.1)

        if file.state.name == "FAILED":
            raise ValueError(file.state.name)

        response = media_analysis_model.generate_content(file)
        
        if response.candidates:
            if response.candidates[0].finish_reason == 1:
                return response.text
            else:
                return None
        else:
            return None

@router.post("/visual-search")
async def search_by_user_query_n_image(request: SearchRequest):
    try:
        image_path = ""
        image_analysis_text = ""

        parsed_url = urlparse(request.image_url)
        filename = os.path.basename(parsed_url.path)
        image_path = os.path.join("media", filename)
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        await download_media(request.image_url, image_path)

        file = genai.upload_file(path=image_path)
    
        image_analysis_text = await generate_image_analysis_response(file)

        if os.path.exists(image_path):
            os.remove(image_path)

        user_query = request.query + " text from image analysis: " + image_analysis_text
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

        chunk_analysis_response = chunk_analysis_model.generate_content(["image: ", file, "\n", json.dumps(data)])

        genai.delete_file(file)

        return {"success": True, "status": 200, "message": "Query successful!", "result": chunk_analysis_response.text}
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error",}

