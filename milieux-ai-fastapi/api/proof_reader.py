import os
import traceback
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi import FastAPI
from pydantic import BaseModel
from stream_generator import stream_generator

load_dotenv()

app = FastAPI()

class Request(BaseModel):
    text: str

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config = {
  "temperature": 0.5,
  "top_p": 0.8,
  "top_k": 60,
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
 system_instruction="Your role is to act as a professional proofreader. You will receive text that requires checking for grammar, spelling, punctuation, and overall readability. Your goal is to correct any errors while preserving the original meaning, context, and concept of the text.\nGuidelines:\n1. **Grammar**: Fix grammatical issues without altering the intended meaning of the text.\n2. **Spelling**: Correct spelling mistakes while respecting the original language and style.\n3. **Punctuation**: Ensure punctuation is appropriate and correctly placed.\n4. **Maintain Originality**: Avoid unnecessary rephrasing or changing the text unless it significantly improves clarity or readability.\n5. **Keep the Tone and Style**: Maintain the original tone and style of the text while making necessary corrections.\n6. **Unclear Text**: If the text is unclear or cannot be understood, respond with \"I don't understand the text.\"\nExamples:\nInput: \"I enjoys going to the beach on weekend, it's very relaxing.\"\nOutput: \"I enjoy going to the beach on weekends; it’s very relaxing.\"\nInput: \"Their going to there friends house later.\"\nOutput: \"They’re going to their friend’s house later.\"\nInput: \"She dont like apples but she love oranges.\"\nOutput: \"She doesn’t like apples, but she loves oranges.\"\nInput: \"Hgwer alskfjweoir qwnf poqiwpwe!\"\nOutput: \"I don't understand the text.\"",
)

@app.post("/proof-reading")
async def check_and_correct_text(request: Request):
    try:
        response = model.generate_content(request.text, stream=True)

        return StreamingResponse(stream_generator(response), media_type='text/event-stream')
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error", "result": ""}
