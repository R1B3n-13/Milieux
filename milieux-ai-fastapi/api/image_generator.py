import os
import traceback
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi import FastAPI
from openai import OpenAI
from pydantic import BaseModel
from stream_generator import stream_generator

load_dotenv()

app = FastAPI()

class Request(BaseModel):
    text: str
    model: str

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config = {
  "temperature": 1,
  "top_p": 0.85,
  "top_k": 70,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

prompt_generation_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  safety_settings={
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,      
    },
 system_instruction="Your role is to generate strong and detailed image prompts based on user queries. These prompts will be used to create images through an image generation model. You will handle two types of requests: normal image prompts and advertisement image prompts. Do not include any introductory or concluding remarks in your response. The prompt should be within 700 tokens.\nGuidelines:\n1. **Understand the Query**: Analyze the user’s query to grasp the tone, style, and specific requirements for the image prompt.\n2. **Normal Image Prompts**: For general or non-advertisement-related requests, generate a prompt that is creative, vivid, and captures the essence of the user's description. The prompt should be detailed enough to guide the image generation model but flexible enough to allow for artistic interpretation.\n3. **Advertisement Image Prompts**: Handle requests for advertisement images with extra precision and care. These prompts should:\n   - Clearly depict the brand or company, ensuring that the company name and any specific textual content mentioned in the query are accurately reflected in the prompt.\n - Emphasize high quality and realism unless the user specifies a preference for a different style (e.g., cartoonish).\n - Include instructions for any textual elements that need to be displayed in the image, such as slogans, product offerings, or contact information.\n - If the user provides specific requirements for the advertisement, ensure these are incorporated into the prompt in a way that aligns with the intended marketing message.\n4. **Tone and Style**: Match the tone of the prompt to the user's request. For example, if the request is for a fun or whimsical image, ensure the prompt conveys that mood. If the request is for a professional or corporate advertisement, ensure the prompt reflects a more serious and polished tone.\n5. **Quality Focus**: Always prioritize the creation of high-quality image prompts, particularly for advertisements where clarity, brand representation, and impact are crucial.\n6. **Example Handling**:\n - If the query is vague or open-ended, generate a prompt that provides creative direction while leaving room for interpretation.\n - If the query is detailed or specific, ensure that all relevant elements are included in the prompt.\nExamples:\n1. **Normal Image Prompt**:\n - User Query: \"A serene mountain landscape at dawn.\"\n - Output: \"A peaceful mountain range bathed in the soft, golden light of dawn, with mist rolling through the valleys and a clear, pale blue sky overhead.\"\n2. **Advertisement Image Prompt**:\n - User Query: \"Create an advertisement for 'Nature's Fresh Juices' with the slogan 'Freshness in Every Sip'.\"\n - Output: \"A high-quality, realistic image featuring a vibrant glass of fresh juice with condensation on the outside, surrounded by ripe fruits like oranges and berries. The background shows a sunny orchard with trees laden with fruit. The company name 'Nature's Fresh Juices' is prominently displayed at the top in bold, green font, with the slogan 'Freshness in Every Sip' written elegantly below the glass.\"\n3. **Cartoonish Advertisement**:\n - User Query: \"A fun, cartoonish ad for a children's book company called 'StoryTime Adventures'.\"\n - Output: \"A playful, cartoon-style image featuring animated characters of children reading colorful books under a large, whimsical tree. The company name 'StoryTime Adventures' is displayed in a bubbly, vibrant font at the top, with a tagline like 'Let Your Imagination Soar!' below. The scene is set in a magical forest with twinkling lights and friendly animals.\"\n",
)

@app.post("/generate-image")
async def generate_image(request: Request):
    try:
        prompt_generation_response = prompt_generation_model.generate_content("Text: " + request.text)

        image_generation_client = OpenAI(
            api_key=os.environ['OPENAI_API_KEY'],
            base_url=os.environ['OPENAI_BASE_URL']
        )

        image_generation_response = image_generation_client.images.generate(
            model=request.model,
            prompt=prompt_generation_response.text,
            size="1024x1024"
        )

        print(image_generation_response)

        return {"success": True, "status": 200, "message": "Image generated successfully!", "result": ""}
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        return {"success": False, "status": 500, "message": "Internal server error", "image": ""}
