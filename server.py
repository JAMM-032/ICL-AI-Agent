
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os

from main import call_llm, InputParser

# The API should be live by running "uvicorn server:app --reload"

app = FastAPI()

parser = InputParser()
client = OpenAI(api_key=os.environ['OPENAI-API'])

class Message(BaseModel):
    content: str

class ResponseModel(BaseModel):
    response: str

@app.post("/submit", response_model=ResponseModel)
async def give_response(message: Message):
    response = call_llm(client, parser.parse_user_input(message.content))
    return ResponseModel(response = response)
