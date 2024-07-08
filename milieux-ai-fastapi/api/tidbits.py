import os
import urllib3
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from urllib.parse import urlparse
from typing import Optional

load_dotenv()

app = FastAPI()

class Request(BaseModel):
    text: str
    image_url: Optional[str] = None

async def download_image(url, save_as):
    http = urllib3.PoolManager()
    response = http.request('GET', url)
    
    if response.status != 200:
        raise HTTPException(status_code=response.status, detail="Failed to download image")
    
    with open(save_as, 'wb') as file:
        file.write(response.data)

async def generate_response(image_path: str):
    genai.configure(api_key=os.environ['GEMINI_API_KEY'])
    model = genai.GenerativeModel('gemini-1.5-flash')

    if(image_path):
        file = genai.upload_file(path=image_path)
        response = model.generate_content([file, "what's in the picture?"])
    else:
        response = model.generate_content("Hello, Gemini!")

    return response.text

@app.post("/tidbits")
async def get_tidbits(request: Request):
    image_path = ""
    
    if request.image_url:
        parsed_url = urlparse(request.image_url)
        filename = os.path.basename(parsed_url.path)
        image_path = os.path.join("images", filename)
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        await download_image(request.image_url, image_path)
    
    response_text = await generate_response(image_path)

    if os.path.exists(image_path):
        os.remove(image_path)

    return {"response": response_text}
