import os
import time
from urllib.parse import urlparse
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from utils.download_media import download_media

load_dotenv()

router = APIRouter()

class Request(BaseModel):
    text: str
    media_url: Optional[str] = None

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config = {
  "temperature": 0.1,
  "top_p": 0.8,
  "top_k": 60,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,      
    },
  system_instruction="As a social media content analyst, your role is to analyze the provided content (text, video, audio, or combinations thereof) and generate informative, factual, or educational tidbits directly related to the content. Ensure that the response is concise, relevant, and devoid of any introductory or concluding remarks. If the analysis does not yield any informative, factual, or educational content, return \"Nothing to show\". Do not include statements like \"As an AI, I don't have feelings, but I appreciate your sentiment\" or any similar phrases. Instead, return \"Nothing to show\". When there's Harassment, Hate, Sexually Explicit or Dangerous Content, return \"Nothing to show\". Generate a response from any part of the content (text, video, photo, audio) if there is relevant information to be found in one part but not another. Here are some examples to guide your output:\nExamples:\nInput: A photo of the Northern Lights.\nOutput: The Northern Lights, also known as Aurora Borealis, are a natural light display predominantly seen in high-latitude regions around the Arctic and Antarctic. They are caused by collisions between electrically charged particles from the sun that enter the Earth's atmosphere.\nInput: A video of a soccer match.\nOutput: Soccer, also known as football in most countries, is the world's most popular sport, played by over 250 million players in over 200 countries. The FIFA World Cup is the most widely viewed and followed sporting event in the world, surpassing even the Olympic Games.\nInput: Text: \"Exploring the Amazon Rainforest\"\nOutput: The Amazon Rainforest is the largest rainforest in the world, covering over 5.5 million square kilometers. It is home to an estimated 390 billion individual trees divided into 16,000 species. The rainforest produces 20% of the world's oxygen and is often referred to as the Earth's lungs.\nInput: Text with photo: \"Visiting the Eiffel Tower\"\nOutput: The Eiffel Tower, located in Paris, France, was completed in 1889 and stands at 324 meters tall. It was initially criticized by some of France's leading artists and intellectuals for its design but has since become a global cultural icon of France and one of the most recognizable structures in the world.\nInput: A blurry image with no discernible features.\nOutput: Nothing to show\nInput: Text: \"Hello guys\"\nOutput: Nothing to show\nInput: Text: \"life is so boring\"\nOutput: Nothing to show\nInput: Text: \"I love my pet.\" Photo: An image of a horse\nOutput: Horses have been used in therapy for their calming presence and ability to help individuals develop confidence and emotional awareness. They are also known for their strong social bonds and intelligence.\nInput: Text: \"I love visiting Indonesia.\"\nOutput: Indonesia is an archipelago consisting of over 17,000 islands, making it the largest island country in the world. It is known for its diverse cultures, languages, and biodiversity. The country is home to the Komodo dragon, the world's largest lizard, and boasts iconic sites such as Bali, Borobudur Temple, and Raja Ampat Islands.",
)

async def generate_response(media_path: str, text: str):
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

        response = model.generate_content([file, text])
        genai.delete_file(file)
    else:
        response = model.generate_content(text)

    if response.candidates[0].finish_reason == 1:
        return {"success": True,
                "status": 200,
                "message": "Tidbits generated successfully",
                "finish_reason": response.candidates[0].finish_reason,
                "text": response.text}
    else:
        return {"success": True,
                "status": 200,
                "message": "Tidbits generation failed",
                "finish_reason": response.candidates[0].finish_reason,
                "text": ""}

@router.post("/tidbits")
async def get_tidbits(request: Request):
    try:
        media_path = ""
    
        if request.media_url:
            parsed_url = urlparse(request.media_url)
            filename = os.path.basename(parsed_url.path)
            media_path = os.path.join("media", filename)
            os.makedirs(os.path.dirname(media_path), exist_ok=True)
            await download_media(request.media_url, media_path)
    
        response = await generate_response(media_path, request.text)

        if os.path.exists(media_path):
            os.remove(media_path)

        return response
    
    except:
        return {"success": False, "status": 500, "message": "Internal server error", }
