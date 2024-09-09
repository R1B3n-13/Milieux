import json

def stream_generator(chunks):
    try:
        for chunk in chunks:
            if chunk.candidates[0].content is not None:
                yield f"{json.dumps({"success": True,
                                    "status": 200,
                                    "message": "Part generation successful!",
                                    "result": chunk.candidates[0].content.parts[0].text})}|||"
    
    except Exception as e:
        raise e
            
   
       