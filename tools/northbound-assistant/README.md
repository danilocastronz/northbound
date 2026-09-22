# northbound-assistant

Part 4's companion tool, built progressively across chapters 13
through 16. This is not part of the Northbound API itself — it's a
separate Python project that calls the Anthropic API directly,
drafting first replies to Northbound support tickets.

Each `stepN_*.py` file is a checkpoint matching the chapter of the
same number. `assistant.py`, added in chapter 16, is the finished
command line tool.

## Setup

```bash
cd tools/northbound-assistant
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then add your real API key
```
