from typing import Any, Dict, List, Optional

from uagents import Model, Protocol


class Coordinates(Model):
    latitude: float
    longitude: float


class POIAreaRequest(Model):
    loc_search: Coordinates
    radius_in_m: int
    limit: int = 20
    query_string: str
    filter: Dict[str, Any] = {}


class POI(Model):
    placekey: str
    location_name: str
    brands: Optional[List[str]] = None
    top_category: Optional[str] = None
    sub_category: Optional[str] = None
    location: Coordinates
    address: str
    city: str
    region: Optional[str] = None
    postal_code: str
    iso_country_code: str
    metadata: Optional[Dict[str, Any]] = None

class POIResponse(Model):
    data: List[str]

from uagents import Agent, Context

agent = Agent(name="agent2",seed="xoxoxo",port=8001, mailbox=True)

GMAPS_AGENT_ADDRESS = "agent1qwjxllsh6k6f9q4t7qllw85ad82qunzac9yncu33ynr9tmll5d9cgs6e7xq"

example_request = POIAreaRequest(
    loc_search=Coordinates(latitude=51.53160339999999, longitude=-0.1235978),
    radius_in_m=1500,
    query_string="coffee shop",
)

@agent.on_event("startup")
async def handle_startup(ctx: Context):
    await ctx.send(GMAPS_AGENT_ADDRESS, example_request)
    ctx.logger.info(f"Sent request to  agent: {example_request}")


@agent.on_message(POIResponse)
async def handle_response(ctx: Context, sender: str, msg: POIResponse):
    ctx.logger.info(f"Received {len(msg.data)} pois from: {sender}")


if __name__ == "__main__":
    agent.run()
