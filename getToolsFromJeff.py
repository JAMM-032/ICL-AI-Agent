from typing import Any, Dict, List, Optional
import json
import os
from time import sleep
from uagents import Model, Protocol, Field, Agent, Context
import asyncio

# File to store the latest response
RESPONSE_FILE = "agent_response.json"

class RAGRequest(Model):
    """
    Defines the structure for incoming RAG (Retrieval-Augmented Generation) requests.
    
    Attributes:
        url (str): The YouTube URL to scrape.
        user_query (List[str]): The user's queries related to the website content.
    """
    url: str = Field(description="The website URL to scrape.")
    user_query: List[str] = Field(description="The user's queries related to the website content.")

class RAGResponse(Model):
    """
    Defines the structure for responses generated from the RAG system.
    
    Attributes:
        response (str): The AI-generated answer based on scraped content.
    """
    response: str = Field(description="The AI-generated answer based on scraped content.")

agent = Agent(name="agent32",seed="xoxoxo",port=8003, mailbox=True)

YOUTUBE_RAG_AGENT_ADDRESS = "agent1qdaarjf9fent8y0fmnd47lk66w9nuyx7j6042mlpyk6zsehq7caz2h8cwu3"

example_request = RAGRequest(
    url="https://www.youtube.com/watch?v=2TL3DgIMY1g",
    user_query = ["Does the video relate to DIY?", "Are there any amazon links provided for building?"],
)

@agent.on_event("startup")
async def handle_startup(ctx: Context):
    await ctx.send(YOUTUBE_RAG_AGENT_ADDRESS, example_request)
    ctx.logger.info(f"Sent request to  agent: {example_request}")
    
# Store the latest response in a file when received
@agent.on_message(RAGResponse)
async def handle_response(ctx: Context, sender: str, msg: RAGResponse):
    ctx.logger.info(f"Received message: {msg.response}")

if __name__ == "__main__":
    agent.run()
