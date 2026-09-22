from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

client = Anthropic()

system_prompt = """
<instructions>
Read the message in <customer_message> tags. Classify it as one
of: billing, delivery-delay, damaged-item, or other. Then draft a
short, polite first reply. Do not promise a delivery date unless
the customer's message already states one. If the issue sounds
like a bug rather than a routine question, add a line starting
with INTERNAL: after your reply, explaining why.

Respond in this exact format:
<category>the category</category>
<reply>your drafted reply</reply>
</instructions>

<examples>
<example>
<customer_message>My order still hasn't arrived and it's been
2 weeks.</customer_message>
<category>delivery-delay</category>
<reply>I'm sorry for the wait. Let me look into your shipment
right away and get back to you with an update.</reply>
</example>
</examples>
"""

message = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1024,
    system=system_prompt,
    messages=[
        {
            "role": "user",
            "content": (
                "<customer_message>My package says delivered but "
                "I don't have it, and it's been like that since "
                "yesterday. This is the Trailhead Cargo "
                "shipment.</customer_message>"
            ),
        }
    ],
)


for block in message.content:
    if block.type == "text":
        print(block.text)
