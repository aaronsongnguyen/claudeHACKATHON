from anthropic import Anthropic
from config import ANTHROPIC_API_KEY
from tools import find_leads, send_email
import json
import threading
import time
from tools import find_leads, send_email, check_for_replies

client = Anthropic(api_key=ANTHROPIC_API_KEY)

history = [
    {
        "role": "user",
        "content": (
            "You are a helpful customer discovery agent and your goal is to support my small start up. My start up wants to know if there is actually a gap in the market and if my product/service actually meets customers' needs."
            "Your job is to help me find leads based on my ideal customer profile, "
            "ask to use tools when needed, and write personalized emails once you find good targets."
            "Make sure to incorporate the startup's mission and target customer profile that I provide. "
            "Use them when writing emails and when evaluating whether a lead is a good fit.\n\n"
            "The emails you write should have the goal of evaluating whether there is a need for this start up by basically asking customers whether they would actually use this product/service - so you can say something like 'We have a new product! Is this something you would use?'\n\n"
            "If you need help (e.g., to find people), return TOOL_CALL in this format:\n"
            'TOOL_CALL: {"tool": "find_leads", "industry": "edtech", "role": "CTO"}\n\n'
            "Once you receive TOOL_RESULT, continue reasoning and decide what to do next."
            "If you need to send an email, return TOOL_CALL in this format:\n"
            'TOOL_CALL: {"tool": "send_email", "to": "someone@example.com", "subject": "Hello", "body": "Hi there!"}\n\n'
            "Always return TOOL_CALL before attempting to write or act on any tool result. Never fake a TOOL_RESULT. "
            "Wait for TOOL_RESULT to be returned by the system, then proceed with reasoning."
        )
    }
]

def run_agent(user_input):
    global history
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
            elif tool == "send_email":
                result = send_email(
                    to_email=payload["to"],
                    subject=payload["subject"],
                    body=payload["body"]
                )
                tool_response = json.dumps(result)
            else:
                tool_response = json.dumps({"status": "error", "message": "Unknown tool"})

            # print("\n[TOOL] Result:", tool_response)
            history.append({"role": "user", "content": f"TOOL_RESULT: {tool_response}"})
            return run_agent("Here is the tool result.")
        except Exception as e:
            print("Tool call failed:", e)

if __name__ == "__main__":
    print("Claude Customer Discovery Agent (type 'exit' to quit)\n")
    
    # def background_reply_checker():
    #     seen_replies = set()
    #     while True:
    #         replies = check_for_replies("Seeking feedback")  # or whatever subject you use
    #         for reply in replies:
    #             key = (reply["from"], reply["subject"])
    #             if key not in seen_replies:
    #                 seen_replies.add(key)

    #                 alert_msg = (
    #                     f"ALERT: You received a reply from {reply['from']} with subject '{reply['subject']}'. "
    #                     f"Snippet: {reply['snippet']}"
    #                 )
    #                 print(f"\n🚨 {alert_msg}")
    #                 history.append({"role": "user", "content": alert_msg})
    #                 run_agent(alert_msg)

    #         time.sleep(60 * 5)  # check every 5 minutes

    # threading.Thread(target=background_reply_checker, daemon=True).start()
    
    startup_description = input("What is your startup about?\n> ")
    target_customer = input("Who is your target customer? (e.g., CTOs in edtech, college students in tech)\n> ")

    # Feed into Claude's memory
    history.append({
        "role": "user",
        "content": (
            f"My startup is about: {startup_description}. "
            f"My target customer is: {target_customer}. "
            "Keep this in mind when writing emails or selecting leads. "
            "Always personalize the outreach and ask if they would use this product/service."
        )
    })

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        run_agent(user_input)