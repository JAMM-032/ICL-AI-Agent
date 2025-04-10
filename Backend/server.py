from fastapi import FastAPI, Query
from uagents.query import send_sync_message
from openai import OpenAI
import os
import time
from typing import Any, Dict
from pydantic import BaseModel
from main import call_llm, InputParser
from getCoordinate import get_location, GEO_COORDINATE_AGENT_ADDRESS
from getToolsFromJeff import agent, RAGRequest, RAGResponse, YOUTUBE_RAG_AGENT_ADDRESS
from uagents import Agent, Context, Model
import json
from datetime import datetime
from uuid import uuid4
import requests
from SentimentalAnalysis import get_aspect_and_score, get_Coordinates, get_score
from uagents_core.contrib.protocols.chat import (
    ChatMessage,
    TextContent,
    ChatAcknowledgement
)
from getClosestShops import agent, POIResponse, Coordinates, POIAreaRequest, GMAPS_AGENT_ADDRESS
from getToolsFromYoutube import get_tools_from_youtube
class GeolocationResponse(BaseModel):
    latitude: float
    longitude: float

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
    
# Define your models
class Request(Model):
    text: str

class Response(Model):
    timestamp: int
    text: str
    agent_address: str

class GeolocationRequest(Model):
    address: str

class GeolocationResponse(Model):
    latitude: float
    longitude: float

@app.post("/submit", response_model=ResponseModel)
async def give_response(message: Message):
    response = call_llm(client, parser.parse_user_input(message.content))
    return ResponseModel(response = response)

@app.get("/api/youtube-rag")
async def question_answering(
    url: str
):
    request = RAGRequest(url=url, user_query=["Is the video related to DIY?", "Are there any amazon links provided for building?"])
    answer = await send_sync_message(destination=YOUTUBE_RAG_AGENT_ADDRESS, message=request)
    response = json.loads(answer)["response"]
    print(response)
    if response[0] == "Yes." or response[0] == "Yes" or response[0] == "yes":
        print(response[1])
        amazon_link_list = json.loads(response[1])
        final_amazon_link_list = []
        for link in amazon_link_list:
            # Shortened Amazon URL

            # Perform a HEAD request and allow redirects
            response = requests.head(link, allow_redirects=True)

            # Output the final URL
            final_url = response.url
            print("Final URL:", final_url)
            final_amazon_link_list.append(final_url)
        return {"response": final_amazon_link_list}
    else:
        return {"response": "false"}

@app.get("/api/get-location")
async def get_location(request: str):
    initial_message = GeolocationRequest(address=request)
    G_ADDRESS = "agent1qvnpu46exfw4jazkhwxdqpq48kcdg0u0ak3mz36yg93ej06xntklsxcwplc"
    # First try with the expected type
    raw_answer = await send_sync_message(
        destination=G_ADDRESS, 
        message=initial_message
    )
    
    return {"success": True, "data": raw_answer}


@app.get("/api/get-repairs")
async def get_repairs(request: str):
    url = "https://api.asi1.ai/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + os.getenv("ASI_API_KEY")
    }
    
    body ={
    "model": "asi1-mini",
    "messages": [
        {
        "role": "user",
        "content": "You are a helpful assistant. You will be given a request and you will need to return a name of location that is related to the request and only return the name of the location. here is the request: " + request
        }
    ],
    "temperature": 0.7,
    "stream": False,
    "max_tokens": 8000
    }

    # Send a GET request
    response = requests.post(url, headers=headers, json=body)

    # Raise an exception for HTTP errors (status codes 4xx or 5xx)
    response.raise_for_status()

    # Parse the JSON response into a Python dictionary
    data = response.json()
    location = data["choices"][0]["message"]["content"]
    print(data)
    # get the location from the request
    location = get_Coordinates(location)
    request = POIAreaRequest(
        loc_search=Coordinates(latitude=location["lat"], longitude=location["lng"]),
        radius_in_m=1500,
        query_string="repair shop",
    )
    answer = await send_sync_message(destination=GMAPS_AGENT_ADDRESS, message=request)
    # get the aspect and score from the answer
    aspects = get_aspect_and_score(answer)
    return {"response": aspects}

@app.get("/api/get-repairs/recommendations")
async def get_repairs(request: str, aspect: str):
    # get the location from the request
    location = get_Coordinates(request)
    request = POIAreaRequest(
        loc_search=Coordinates(latitude=location["lat"], longitude=location["lng"]),
        radius_in_m=1500,
        query_string="repair shop",
    )
    answer = await send_sync_message(destination=GMAPS_AGENT_ADDRESS, message=request)
    # get the aspect and score from the answer
    aspects = get_score(answer, aspect)
    return {"response": aspects}

@app.get("/api/get-tools-ASI")
async def get_tools(request: str):
    request = get_tools_from_youtube(request).content
    answer = await send_sync_message(destination=YOUTUBE_RAG_AGENT_ADDRESS, message=request)
    # using ASI to get the tools
    print(answer)
    return {"response": answer}

@app.get("/api/get-recommendations")
async def get_recommendations(request: str):
    request = get_tools_from_youtube(request).content
    answer = await send_sync_message(destination=YOUTUBE_RAG_AGENT_ADDRESS, message=request)
    print(answer)
    return {"response": answer}

