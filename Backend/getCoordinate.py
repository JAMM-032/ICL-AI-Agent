from datetime import datetime
from uuid import uuid4
from uagents import Agent, Protocol, Context, Model
from time import sleep

#import the necessary components from the chat protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    TextContent,
    chat_protocol_spec,
)
import requests
import json
import os
import dotenv
# Load environment variables from .env file
dotenv.load_dotenv()

# Intialise agent1
agent1 = Agent(name="agent12",seed="xoxoxoxox",port=8000, mailbox=True)

# Store agent2's address (you'll need to replace this with actual address)
GEO_COORDINATE_AGENT_ADDRESS = "agent1qvnpu46exfw4jazkhwxdqpq48kcdg0u0ak3mz36yg93ej06xntklsxcwplc"

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)


#Startup Handler - Print agent details and send initial message
@agent1.on_event("startup")
async def startup_handler(ctx: Context):
    # Print agent details
    ctx.logger.info(f"My name is {ctx.agent.name} and my address is {ctx.agent.address}")
    
    # Send initial message to agent2
    initial_message = ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text="I want to get the coordinates of Kings Cross Station London")]
    )
    
    await ctx.send(GEO_COORDINATE_AGENT_ADDRESS, initial_message)

# Message Handler - Process received messages and send acknowledgements
@chat_proto.on_message(ChatMessage)
async def handle_message(ctx: Context, sender: str, msg: ChatMessage):
    for item in msg.content:
        if isinstance(item, TextContent):
            # Log received message
            ctx.logger.info(f"Received message from {sender}: {item.text}")
            # Send acknowledgment
            ack = ChatAcknowledgement(
                timestamp=datetime.utcnow(),
                acknowledged_msg_id=msg.msg_id
            )
            await ctx.send(sender, ack)
            coordinates = item.text.split("\n")
            print(coordinates)
            latitude = coordinates[0].split(":")[1].strip()
            longitude = coordinates[1].split(":")[1].strip()
            ctx.logger.info(f"Extracted coordinates: Latitude: {latitude}, Longitude: {longitude}")
            get_location(latitude, longitude)

# Acknowledgement Handler - Process received acknowledgements
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")

# Include the protocol in the agent to enable the chat functionality
# This allows the agent to send/receive messages and handle acknowledgements using the chat protocol
agent1.include(chat_proto, publish_manifest=True)

# get locations from google maps via latitude and longitude
def get_location(latitude, longitude):
    placeId_list = []
    url = f'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={str(latitude)},{str(longitude)}&radius=1500&type=restaurant&keyword=cruise&key={os.getenv("GOOGLE_MAPS_API_KEY")}'
    response = requests.get(url)
    data = json.loads(response.text)
    for place in data['results']:
        placeId = place['place_id']
        placeId_list.append(placeId)
    print(placeId_list)
    
if __name__ == '__main__':
    agent1.run()