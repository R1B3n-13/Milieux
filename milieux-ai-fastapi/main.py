from fastapi import FastAPI
from api.caption_generator import router as caption_generator_router
from api.image_generator import router as image_generator_router
from api.site_search import router as site_search_router
from api.visual_search import router as visual_search_router
from api.proof_reader import router as proof_reader_router
from api.custom_chatbot import router as custom_chatbot_router
from api.tidbits import router as tidbits_router
from api.chatbot_sentia import router as sentia_chatbot_router

app = FastAPI()

app.include_router(caption_generator_router)
app.include_router(image_generator_router)
app.include_router(site_search_router)
app.include_router(visual_search_router)
app.include_router(proof_reader_router)
app.include_router(custom_chatbot_router)
app.include_router(sentia_chatbot_router)
app.include_router(tidbits_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
