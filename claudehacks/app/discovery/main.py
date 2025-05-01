from anthropic import Anthropic
from config import ANTHROPIC_API_KEY
from tools import find_leads, send_email, check_for_replies
import json
import sys
import traceback

# Initialize the client with error handling
try:
    client = Anthropic(api_key=ANTHROPIC_API_KEY)
except Exception as e:
    print(f"Error initializing Anthropic client: {str(e)}", file=sys.stderr)
    sys.exit(1)

history = [
    {
        "role": "user",
        "content": (
            "You are a helpful customer discovery agent and your goal is to support my small start up. My start up wants to know if there is actually a gap in the market and if my product/service actually meets customers' needs."
            "Your job is to help me find leads based on my ideal customer profile, "
            "ask to use tools when needed, and write personalized emails once you find good targets.\n\n"
            "If you need help (e.g., to find people), return TOOL_CALL in this format:\n"
            'TOOL_CALL: {"tool": "find_leads", "industry": "edtech", "role": "CTO"}\n\n'
            "Once you receive TOOL_RESULT, continue reasoning and decide what to do next."
            "If you need to send an email, return TOOL_CALL in this format:\n"
            'TOOL_CALL: {"tool": "send_email", "to": "someone@example.com", "subject": "Hello", "body": "Hi there!"}\n\n'
        )
    }
]

def run_agent(user_input):
    global history
    try:
        history.append({"role": "user", "content": user_input})

        response = client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=300,
            temperature=0.7,
            messages=history
        )

        reply = response.content[0].text.strip()
        print("\nClaude:", reply)
        history.append({"role": "assistant", "content": reply})

        # Tool usage
        if "TOOL_CALL:" in reply:
            try:
                payload = json.loads(reply.split("TOOL_CALL:")[1].strip())
                tool = payload.get("tool")

                if tool == "find_leads":
                    leads = find_leads(payload["industry"], payload["role"])
                    tool_response = json.dumps(leads)
                    print(f"TOOL_RESULT: {tool_response}")
                elif tool == "send_email":
                    result = send_email(payload["to"], payload["subject"], payload["body"])
                    print(f"TOOL_RESULT: {json.dumps(result)}")
                elif tool == "check_replies":
                    result = check_for_replies()
                    print(f"TOOL_RESULT: {json.dumps(result)}")
            except Exception as e:
                print(f"Error in tool execution: {str(e)}", file=sys.stderr)
                print(f"TOOL_RESULT: {json.dumps({'error': str(e)})}")

        return reply
    except Exception as e:
        print(f"Error in run_agent: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return f"Error: {str(e)}"

if __name__ == "__main__":
    try:
        # Read input from stdin
        user_input = sys.stdin.read().strip()
        if not user_input:
            print("Error: No input provided", file=sys.stderr)
            sys.exit(1)

        # Run the agent
        result = run_agent(user_input)
        print(result)
    except Exception as e:
        print(f"Error in main: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        sys.exit(1)