import os
from fastapi import FastAPI
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

class AddPostRequest(BaseModel):
    text: str
    postId: int

class SearchRequest(BaseModel):
    query: str

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



get_document_request = glm.GetDocumentRequest(name="corpora/" + os.environ['SITE_SEARCH_CORPUS'] + "/documents/social-media-posts")

get_document_response = retriever_service_client.get_document(get_document_request)
document_resource_name = get_document_response.name

@app.post("/add-post")
async def add_post_to_corpus(request: AddPostRequest):
    chunk = glm.Chunk(data={'string_value': request.text})
    chunk.custom_metadata.append(glm.CustomMetadata(key="post_id",
                                                numeric_value=request.postId))
    
    create_chunk_request = glm.CreateChunkRequest(parent=document_resource_name, chunk=chunk)
    create_chunk_response = retriever_service_client.create_chunk(create_chunk_request)

    print(create_chunk_response)

    return {"response": "post added to corpus successfully!"}

@app.post("/search")
async def search_by_user_query(request: SearchRequest):
    user_query = request.query
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

    return {"chunks": chunks}

