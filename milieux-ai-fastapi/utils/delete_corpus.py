import os
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.environ['GEMINI_API_KEY'])

service_account_file_name = 'service_account_key.json'

credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

delete_corpus_request = glm.DeleteCorpusRequest(name="corpora/" + os.environ['SITE_SEARCH_CORPUS'], force=True)
delete_corpus_response = retriever_service_client.delete_corpus(delete_corpus_request)

print(delete_corpus_response)

delete_corpus_request = glm.DeleteCorpusRequest(name="corpora/" + os.environ['CUSTOM_CHATBOT_CORPUS'], force=True)
delete_corpus_response = retriever_service_client.delete_corpus(delete_corpus_request)

print(delete_corpus_response)