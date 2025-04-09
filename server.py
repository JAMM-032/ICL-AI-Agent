
from fastapi import FastAPI, Query
from pydantic import BaseModel
from uagents.query import send_sync_message
from openai import OpenAI
import os
from main import call_llm, InputParser
from getToolsFromJeff import agent, RAGRequest, RAGResponse, YOUTUBE_RAG_AGENT_ADDRESS
from uagents import Agent, Context
import json
# The API should be live by running "uvicorn server:app --reload"
import dotenv
dotenv.load_dotenv()
app = FastAPI()

parser = InputParser()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
class Message(BaseModel):
    content: str

class ResponseModel(BaseModel):
    response: str

@app.post("/submit", response_model=ResponseModel)
async def give_response(message: Message):
    response = call_llm(client, parser.parse_user_input(message.content))
    return ResponseModel(response = response)

@app.get("/api/youtube-rag")
async def question_answering(
    url: str
):
    request = RAGRequest(url=url, user_query=["Does the video relate to DIY?", "Are there any amazon links provided for building?"])
    answer = await send_sync_message(destination=YOUTUBE_RAG_AGENT_ADDRESS, message=request)
    print(answer)
    return {"response": answer}

@app.get("/api/close-agent")
async def question_answering(
    url: str
):
    request = RAGRequest(url=url, user_query=["Does the video relate to DIY?", "Are there any amazon links provided for building?"])
    answer = await send_sync_message(destination=YOUTUBE_RAG_AGENT_ADDRESS, message=request)
    print(answer)
    return {"response": answer}


