from dotenv import load_dotenv
load_dotenv()

TOOLS = [
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

SHIPMENTS = {
    "NB-10234": {"carrier": "trailhead", "status": "in_transit"},
    "NB-10240": {"carrier": "anchor", "status": "delivered"},
}


def check_shipment_status(shipment_id: str) -> str:
    shipment = SHIPMENTS.get(shipment_id)
    if shipment is None:
        return f"No shipment found with ID {shipment_id}"
    return f"Shipment {shipment_id} via {shipment['carrier']}: {shipment['status']}"

SYSTEM_PROMPT = """
<instructions>
Read the message in <customer_message> tags. If it references a
specific shipment ID, use the check_shipment_status tool before
replying, rather than guessing at the shipment's status. Classify
the message as one of: billing, delivery-delay, damaged-item, or
other. Then draft a short, polite first reply. Do not promise a
delivery date unless the customer's message already states one. If
the issue sounds like a bug rather than a routine question, add a
line starting with INTERNAL: after your reply, explaining why.

Respond in this exact format:
<category>the category</category>
<reply>your drafted reply</reply>
</instructions>
"""

import re


def parse_response(text: str) -> dict:
    category_match = re.search(r"<category>(.*?)</category>", text, re.S)
    reply_match = re.search(r"<reply>(.*?)</reply>", text, re.S)
    internal_match = re.search(r"INTERNAL:\s*(.*)", text, re.S)

    return {
        "category": category_match.group(1).strip() if category_match else "unknown",
        "reply": reply_match.group(1).strip() if reply_match else text.strip(),
        "internal_note": internal_match.group(1).strip() if internal_match else None,
    }

from anthropic import Anthropic

client = Anthropic()


def handle_ticket(customer_message: str) -> dict:
    messages = [
        {
            "role": "user",
            "content": f"<customer_message>{customer_message}</customer_message>",
        }
    ]

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        tools=TOOLS,
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
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

    final_text = next(
        (block.text for block in response.content if block.type == "text"), ""
    )
    return parse_response(final_text)

import argparse
import json
import sys
from datetime import datetime, timezone


def main():
    parser = argparse.ArgumentParser(
        description="Draft a first reply to a Northbound customer message."
    )
    parser.add_argument(
        "message",
        nargs="?",
        help="The customer's message. If omitted, reads from stdin.",
    )
    parser.add_argument(
        "--save",
        metavar="FILE",
        help="Append the result as one JSON line to this file.",
    )
    args = parser.parse_args()

    customer_message = args.message or sys.stdin.read().strip()
    if not customer_message:
        parser.error("no customer message provided")

    result = handle_ticket(customer_message)

    print(f"Category: {result['category']}")
    print(f"\nReply:\n{result['reply']}")
    if result["internal_note"]:
        print(f"\nInternal note: {result['internal_note']}")

    if args.save:
        record = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "customer_message": customer_message,
            **result,
        }
        with open(args.save, "a") as f:
            f.write(json.dumps(record) + "\n")


if __name__ == "__main__":
    main()