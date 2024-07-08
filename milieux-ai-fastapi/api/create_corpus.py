import os
from google.oauth2 import service_account
import google.ai.generativelanguage as glm
from dotenv import load_dotenv

load_dotenv()

service_account_file_name = 'service_account_key.json'

credentials = service_account.Credentials.from_service_account_file(service_account_file_name)

scoped_credentials = credentials.with_scopes(
    ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/generative-language.retriever'])

generative_service_client = glm.GenerativeServiceClient(credentials=scoped_credentials)
retriever_service_client = glm.RetrieverServiceClient(credentials=scoped_credentials)
permission_service_client = glm.PermissionServiceClient(credentials=scoped_credentials)

# create corpus for site search
rag_corpus_1 = glm.Corpus(name="corpora/" + os.environ['SITE_SEARCH_CORPUS'], 
                        display_name="Milieux Semantic Retrieval Corpus for Site Search")

create_corpus_request_1 = glm.CreateCorpusRequest(corpus=rag_corpus_1)
create_corpus_response_1 = retriever_service_client.create_corpus(create_corpus_request_1)

print(create_corpus_response_1)

# create corpus for custom chatbot
rag_corpus_2 = glm.Corpus(name="corpora/" + os.environ['CUSTOM_CHATBOT_CORPUS'], 
                        display_name="Milieux Semantic Retrieval Corpus for Custom Chatbot")

create_corpus_request_2 = glm.CreateCorpusRequest(corpus=rag_corpus_2)
create_corpus_response_2 = retriever_service_client.create_corpus(create_corpus_request_2)

print(create_corpus_response_2)