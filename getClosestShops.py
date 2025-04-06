from datetime import datetime
from uuid import uuid4
from uagents import Agent, Protocol, Context, Model
from time import sleep

from uagents import Agent, Context, Model

#import the necessary components from the chat protocol
from uagents_core.contrib.protocols.chat import (
    ChatAcknowledgement,
    ChatMessage,
    TextContent,
    chat_protocol_spec,
)

# class GeoParkingRequest(Model):
#     latitude: float
#     longitude: float
#     radius_in_meters: int
#     max_results: int


# class CarPark(Model):
#     name: Optional[str]
#     address: Optional[str]
#     latitude: float
#     longitude: float


# class GeoParkingResponse(Model):
#     carparks: List[CarPark]


agent1 = Agent(name="agent2",seed="xoxoxo",port=8001, mailbox=True)

agent2_address = "agent1qvcqsyxsq7fpy9z2r0quvng5xnhhwn3vy7tmn5v0zwr4nlm7hcqrckcny9e"

latitude = 35.7174747
longitude = 139.7941792
radius = 100
max_results = 5

# Initialize the chat protocol
chat_proto = Protocol(spec=chat_protocol_spec)

@agent1.on_event("startup")
async def startup_handler(ctx: Context):
    
    # Print agent details
    ctx.logger.info(f"My name is {ctx.agent.name} and my address is {ctx.agent.address}")
    
    # Send initial message to agent2
    initial_message = ChatMessage(
        timestamp=datetime.utcnow(),
        msg_id=uuid4(),
        content=[TextContent(type="text", text="I want to get list of location satisfy the criteria loc_search = Coordinates(latitude=48.140505822096365, longitude=11.559987118245475), radius_in_m = 500, limit = 10, query_string = coffee shop,")],
    )
    
    await ctx.send(agent2_address, initial_message)

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
            
# Acknowledgement Handler - Process received acknowledgements
@chat_proto.on_message(ChatAcknowledgement)
async def handle_acknowledgement(ctx: Context, sender: str, msg: ChatAcknowledgement):
    ctx.logger.info(f"Received acknowledgement from {sender} for message: {msg.acknowledged_msg_id}")


# Include the protocol in the agent to enable the chat functionality
# This allows the agent to send/receive messages and handle acknowledgements using the chat protocol
agent1.include(chat_proto, publish_manifest=True)


if __name__ == "__main__":
    agent1.run()

