from dotenv import load_dotenv
load_dotenv()

tools = [
    {
        "name": "check_shipment_status",
        "description": (
            "Look up the current status of a Northbound shipment by "
            "its ID. Use this whenever a customer message references "
            "a specific shipment and you need its actual current "
            "status rather than assuming one."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "shipment_id": {
                    "type": "string",
                    "description": "The Northbound shipment ID, e.g. NB-10234",
                }
            },
            "required": ["shipment_id"],
        },
    }
]

shipments = {
    "NB-10234": {"carrier": "trailhead", "status": "in_transit"},
    "NB-10240": {"carrier": "anchor", "status": "delivered"},
}

def check_shipment_status(shipment_id: str) -> str:
    shipment = shipments.get(shipment_id)
    if shipment is None:
        return f"No shipment found with ID {shipment_id}"
    return f"Shipment {shipment_id} via {shipment['carrier']}: {shipment['status']}"

import json
from anthropic import Anthropic

client = Anthropic()

messages = [
    {
        "role": "user",
        "content": (
            "Customer says: 'Where is my shipment NB-10234? It's "
            "been days.' Look up the actual status before replying."
        ),
    }
]

response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    tools=tools,
    messages=messages,
)

while response.stop_reason == "tool_use":
    tool_use_block = next(
        block for block in response.content if block.type == "tool_use"
    )

    if tool_use_block.name == "check_shipment_status":
        result = check_shipment_status(tool_use_block.input["shipment_id"])
    else:
        result = f"Unknown tool: {tool_use_block.name}"

    messages.append({"role": "assistant", "content": response.content})
    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": tool_use_block.id,
                    "content": result,
                }
            ],
        }
    )

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        tools=tools,
        messages=messages,
    )

for block in response.content:
    if block.type == "text":
        print(block.text)