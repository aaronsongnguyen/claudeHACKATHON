import smtplib
from email.message import EmailMessage
import os
import base64
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

def find_leads(industry, role):
    return [
        {"name": "Aaron Nguyen", "email": "jesslyngunadi@berkeley.edu", "company": "Startup Inc"},
        {"name": "Sam Hansen", "email": "samhansen@berkeley.edu", "company": "TechCo"}
    ]

def send_email(to_email, subject, body, from_email="jesslyngunadi33@gmail.com"):
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = from_email
        msg["To"] = to_email
        msg.set_content(body)

        # Use Gmail SMTP (you'll need an app password, not your real one)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(from_email, "lnmf cbbm wfdt hluz")  # secure app password
            smtp.send_message(msg)
        
        return {"status": "success", "to": to_email}
    except Exception as e:
        return {"status": "error", "error": str(e)}

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_gmail_service():
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    else:
        base_dir = os.path.dirname(os.path.abspath(__file__))  # directory of tools.py
        cred_path = os.path.join(base_dir, 'credentials.json')
        flow = InstalledAppFlow.from_client_secrets_file(cred_path, SCOPES)
        creds = flow.run_local_server(port=8080)
        creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)

def check_for_replies(subject_keyword="feedback"):
    service = get_gmail_service()
    results = service.users().messages().list(userId='me', q=f'subject:{subject_keyword} is:inbox').execute()
    messages = results.get('messages', [])

    replies = []
    for msg in messages:
        message = service.users().messages().get(userId='me', id=msg['id']).execute()
        headers = message['payload']['headers']
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), "")
        sender = next((h['value'] for h in headers if h['name'] == 'From'), "")
        snippet = message.get('snippet', '')
        replies.append({
            "from": sender,
            "subject": subject,
            "snippet": snippet
        })
    return replies