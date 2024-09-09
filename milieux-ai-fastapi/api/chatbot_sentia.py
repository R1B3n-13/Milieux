import os
import traceback
from typing import Optional
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv
from pydantic import BaseModel
from PIL import Image
from utils.stream_generator import stream_generator
from utils.download_media import download_media

load_dotenv()

router = APIRouter()

class HistoryItem(BaseModel):
    role: str
    text: Optional[str] = None
    media_url: Optional[str] = None

class MessageRequest(BaseModel):
    text: Optional[str] = None
    media_url: Optional[str] = None
    history: list[HistoryItem]

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config = {
  "temperature": 1.5,
  "top_p": 0.95,
  "top_k": 80,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
  system_instruction="You are an helpful assistant.",
)

@router.post("/chat-sentia")
async def send_message_to_sentia(request: MessageRequest) -> StreamingResponse:
    try:
        chat_history = []
        media_paths = []

        for item in request.history:
            new_parts = []
            if item.text:
                new_parts.append(item.text)
            if item.media_url:
                parsed_url = urlparse(item.media_url)
                filename = os.path.basename(parsed_url.path)
                media_path = os.path.join("media", filename)
                os.makedirs(os.path.dirname(media_path), exist_ok=True)
                
                await download_media(item.media_url, media_path)
                new_parts.append(Image.open(media_path))
                media_paths.append(media_path)

            chat_history.append({
                "role": item.role,
                "parts": new_parts
            })

        message = []
        if request.text:
            message.append(request.text)
        if request.media_url:
            parsed_url = urlparse(request.media_url)
            filename = os.path.basename(parsed_url.path)
            media_path = os.path.join("media", filename)
            os.makedirs(os.path.dirname(media_path), exist_ok=True)

            await download_media(request.media_url, media_path)
            message.append(Image.open(media_path))
            media_paths.append(media_path)

        chat = model.start_chat(history=chat_history)
        response = chat.send_message(message, stream=True)

        for path in media_paths:
            if os.path.exists(path):
                os.remove(path)

        return StreamingResponse(stream_generator(response), media_type='text/event-stream')
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")
