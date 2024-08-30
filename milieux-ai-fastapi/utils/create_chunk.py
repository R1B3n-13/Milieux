from langchain_text_splitters import RecursiveCharacterTextSplitter
import google.ai.generativelanguage as glm
from google.oauth2 import service_account

service_account_file_name = 'service_account_key.json'

credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

async def create_chunk(content: str, document_resource_name: str, key: str, id: int):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=200,
        is_separator_regex=False,
    )
    texts = text_splitter.split_text(content)

    chunks = []
    for text in texts:
        chunk = glm.Chunk(data={'string_value': text})
        chunk.custom_metadata.append(glm.CustomMetadata(key = key, numeric_value = id))
        chunks.append(chunk)
    
    create_chunk_requests = []
    for chunk in chunks:
        create_chunk_requests.append(glm.CreateChunkRequest(parent=document_resource_name, chunk=chunk))
        create_chunk_request = glm.BatchCreateChunksRequest(parent=document_resource_name, requests=create_chunk_requests)
        create_chunk_response = retriever_service_client.batch_create_chunks(create_chunk_request)

    return create_chunk_response