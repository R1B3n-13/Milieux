import urllib3
from fastapi import HTTPException

async def download_media(url, save_as):
    http = urllib3.PoolManager()
    response = http.request('GET', url)
    
    if response.status != 200:
        raise HTTPException(status_code=response.status, detail="Failed to download media")
    
    with open(save_as, 'wb') as file:
        file.write(response.data)