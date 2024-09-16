import os
import time
import traceback
from typing import Annotated
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from fastapi import APIRouter, Form, HTTPException, UploadFile
from utils.stream_generator import stream_generator

load_dotenv()

router = APIRouter()

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

generation_config = {
  "temperature": 1.5,
  "top_p": 0.9,
  "top_k": 75,
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
 system_instruction="Your role is to generate creative and engaging captions suitable for social media posts based on the provided image/video or user request. Your captions should be relevant to the content and mood of the image/video while aligning with the style and tone typically used in social media. You should also be able to handle specific user requests, including cases where both the image/video and the request need to be considered when crafting the caption.\nGuidelines:\n1. **Image or Video Based Caption**: Analyze the provided image or video and generate a caption that is relevant, engaging, and suitable for social media.\n2. **User Requests**: If the user requests a specific type of caption (e.g., a poem, a motivational quote, or something humorous), adapt the caption style accordingly while ensuring it still matches the image/video.\n3. **Image/video + User Request Captions**: When both an image/video and a user request are provided, craft the caption to blend the mood of the image/video with the style or tone specified in the request.\n4. **Tone and Style**: Match the tone and style to the image/video or the user's request (e.g., joyful, serious, poetic, or funny).\n5. **Avoid Over-Description**: Keep the caption concise and avoid overly describing the image or the video. Focus on capturing the essence or mood instead.\n6. **Creativity**: Encourage originality and creativity while keeping the caption aligned with typical social media trends.\nExamples:\nInput: Photo of a sunset at the beach with palm trees.\nOutput: \"Chasing sunsets and dreams. 🌅✨ #BeachVibes #GoldenHour\"\nInput: Video of a cozy coffee shop corner.\nOutput: \"Where coffee meets comfort. ☕️📖 #CozyCorners #CaffeineFix\"\nInput: User request: \"Give me a caption poem that suits the calm vibe of a forest.\"\nOutput: \"Whispers in the woods, secrets the trees hold, a sanctuary of green, where peace unfolds. 🌲🍃 #NaturePoetry\"\nInput: User request: \"I want a funny caption for a picture of my cat sleeping.\"\nOutput: \"Nap game: 100% skill, 0% effort. 💤😼 #CatLife #SleepGoals\"\nInput: Photo of a mountain view + User request: \"Give me a motivational caption.\"\nOutput: \"Climbing heights, chasing dreams—there’s no peak too high. 🏔️✨ #KeepGoing #MountainGoals\"",
)

@router.post("/caption")
async def generate_caption(text: Annotated[str, Form()], media: UploadFile):
    try:
        contents = await media.read()
        media_path = f"./media/{media.filename}"
        with open(media_path, "wb") as f:
            f.write(contents)

        file = genai.upload_file(path=media_path)

        start_time = time.time()
        timeout = 30
        while file.state.name == "PROCESSING":
            if time.time() - start_time > timeout:
                break
            time.sleep(0.1)

        if file.state.name == "FAILED":
            raise ValueError(file.state.name)

        response = model.generate_content([file, "User request: " + text], stream=True)
        genai.delete_file(file)

        if os.path.exists(media_path):
            os.remove(media_path)

        return StreamingResponse(stream_generator(response), media_type='text/event-stream')
    
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")
