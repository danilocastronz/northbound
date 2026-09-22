from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

client = Anthropic()

message = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    system=(
        "You are a support assistant for Northbound, a shipment "
        "tracking tool. Given a customer's message, draft a short, "
        "polite first reply. Do not promise a delivery date unless "
        "the customer's message already states one. If the issue "
        "sounds like a bug rather than a simple question, say so "
        "plainly at the end of your reply, prefixed with INTERNAL:"
    ),
    messages=[
        {
            "role": "user",
            "content": (
                "My package says delivered but I don't have it, and "
                "it's been like that since yesterday. This is the "
                "Trailhead Cargo shipment."
            ),
        }
    ],
)

for block in message.content:
    if block.type == "text":
        print(block.text)
