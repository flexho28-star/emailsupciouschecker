import os
import json
import re
import requests
from typing import Dict, Any, List

# MITRE ATT&CK Reference Database (Common Phishing-related Techniques)
MITRE_DB = {
    "T1566.002": {
        "name": "Phishing: Spearphishing Link",
        "description": "Adversaries send spearphishing emails containing malicious links to lure victims into clicking them, leading to credential harvesting or malware execution."
    },
    "T1566.001": {
        "name": "Phishing: Spearphishing Attachment",
        "description": "Adversaries send spearphishing emails containing malicious attachments (e.g., zip, pdf, docm) designed to execute code when opened by the user."
    },
    "T1566.003": {
        "name": "Phishing: Spearphishing Service",
        "description": "Adversaries use third-party services (e.g., social media, webmail, chat apps) to send phishing links or attachments to targets."
    },
    "T1114": {
        "name": "Email Collection",
        "description": "Adversaries target user emails to collect sensitive business intelligence, credentials, or contacts for subsequent campaigns."
    },
    "T1204.001": {
        "name": "User Execution: Malicious Link",
        "description": "Adversaries rely on a user clicking a malicious link within an email to execute code, download malware, or visit a credential harvesting portal."
    },
    "T1204.002": {
        "name": "User Execution: Malicious Attachment",
        "description": "Adversaries rely on a user opening a malicious attachment to trigger exploit code or macro execution."
    },
    "T1539": {
        "name": "Steal Web Session Cookie",
        "description": "Adversaries capture session cookies to bypass Multi-Factor Authentication (MFA) and hijack active login sessions."
    },
    "T1078": {
        "name": "Valid Accounts",
        "description": "Adversaries use compromised credentials harvested via phishing to log into legitimate services, bypassing perimeter security."
    }
}

def generate_local_analysis(email_text: str, classification: str, indicators: Dict[str, bool]) -> Dict[str, Any]:
    """
    Highly sophisticated local expert system that generates a detailed, 
    structured security report matching the LLM schema.
    """
    text_lower = email_text.lower()
    
    # 1. Determine Social Engineering Techniques
    social_techniques = []
    if indicators.get("urgent_language"):
        social_techniques.append("Urgency & Coercion: Creating a false sense of time-pressure (e.g., 'suspend in 24 hours') to bypass rational thinking.")
    if indicators.get("fake_login") or indicators.get("password_request"):
        social_techniques.append("Authority & Impersonation: Mimicking trusted service portals (Microsoft, PayPal) to exploit user trust.")
    if indicators.get("banking_scam") or indicators.get("financial_fraud"):
        social_techniques.append("Financial Greed/Fear: Using monetary rewards (tax refunds, wire transfers) or financial loss threats to prompt action.")
    if indicators.get("crypto_scam"):
        social_techniques.append("FOMO (Fear Of Missing Out): Leveraging cryptocurrency hype, smart contract upgrades, or wallet restriction threats to steal seed phrases.")
    if not social_techniques:
        social_techniques.append("Pretexting: Presenting a fabricated scenario (like a routine meeting or document share) to establish trust before executing an exploit.")

    # 2. Extract Indicators of Compromise (IOCs)
    iocs = []
    # Extract URLs
    urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', email_text)
    for url in urls:
        domain = url.split("//")[-1].split("/")[0]
        iocs.append(f"Suspicious URL: {url}")
        iocs.append(f"Malicious Domain: {domain}")
    # Extract Email Addresses if present in text
    emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', email_text)
    for email in emails:
        iocs.append(f"Sender/Target Email: {email}")
        
    iocs = list(set(iocs))[:6] # Limit to top 6
    if not iocs:
        iocs.append("No specific external network indicators detected.")

    # 3. Formulate MITRE ATT&CK Mappings
    mitre_mappings = []
    
    # Default Phishing mapping
    if indicators.get("dangerous_attachments"):
        mitre_mappings.append({
            "id": "T1566.001",
            "name": MITRE_DB["T1566.001"]["name"],
            "description": MITRE_DB["T1566.001"]["description"]
        })
        mitre_mappings.append({
            "id": "T1204.002",
            "name": MITRE_DB["T1204.002"]["name"],
            "description": MITRE_DB["T1204.002"]["description"]
        })
    else:
        # Default to link phishing if URLs found
        if urls:
            mitre_mappings.append({
                "id": "T1566.002",
                "name": MITRE_DB["T1566.002"]["name"],
                "description": MITRE_DB["T1566.002"]["description"]
            })
            mitre_mappings.append({
                "id": "T1204.001",
                "name": MITRE_DB["T1204.001"]["name"],
                "description": MITRE_DB["T1204.001"]["description"]
            })
        else:
            # General phishing
            mitre_mappings.append({
                "id": "T1566.003",
                "name": MITRE_DB["T1566.003"]["name"],
                "description": MITRE_DB["T1566.003"]["description"]
            })

    if indicators.get("fake_login") or indicators.get("password_request"):
        mitre_mappings.append({
            "id": "T1114",
            "name": MITRE_DB["T1114"]["name"],
            "description": MITRE_DB["T1114"]["description"]
        })
        mitre_mappings.append({
            "id": "T1078",
            "name": MITRE_DB["T1078"]["name"],
            "description": MITRE_DB["T1078"]["description"]
        })

    # 4. Safety Recommendations
    recommendations = [
        "DO NOT click on any links, scan QR codes, or download attachments from this email.",
        "Verify the sender's identity through an alternative, trusted channel (e.g., call them or visit the official website manually).",
        "Report this email to your organization's security operations center (SOC) or IT department."
    ]
    if indicators.get("password_request"):
        recommendations.append("If you entered your password, change it immediately on the official service portal and enable Multi-Factor Authentication (MFA).")
    if indicators.get("banking_scam") or indicators.get("financial_fraud"):
        recommendations.append("If you provided banking details or credit card numbers, contact your financial institution immediately to freeze your accounts.")

    # 5. Explanations
    if classification == "Phishing":
        danger_explanation = (
            "This email represents a critical threat. The sender is attempting to deceive you into "
            "taking action that will compromise your credentials or financial accounts. The language "
            "exhibits classic social engineering triggers designed to bypass security awareness."
        )
    elif classification == "Suspicious":
        danger_explanation = (
            "This email exhibits several anomalies (e.g. urgent tone, generic domains, or unverified links) "
            "that are highly characteristic of phishing campaigns. While not definitively confirmed, it should "
            "be treated with extreme caution."
        )
    else:
        danger_explanation = (
            "No significant threats were detected. The email appears to be normal correspondence. "
            "Always maintain basic security vigilance."
        )

    return {
        "danger_explanation": danger_explanation,
        "social_engineering_techniques": social_techniques,
        "indicators_of_compromise": iocs,
        "safety_recommendations": recommendations,
        "mitre_mappings": mitre_mappings
    }

def generate_llm_explanation(email_text: str, classification: str, indicators: Dict[str, bool]) -> Dict[str, Any]:
    """
    Attempts to call Google Gemini or OpenAI to perform threat analysis.
    Falls back to a highly detailed local rule-based generator if no keys are found.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    prompt = f"""
    You are an expert Cybersecurity Incident Responder. Analyze this email and classify it.
    Email Text:
    ---
    {email_text}
    ---
    Threat Classification: {classification}
    Triggered Indicators: {json.dumps([k for k, v in indicators.items() if v])}

    Provide a detailed security analysis in JSON format matching this schema:
    {{
        "danger_explanation": "A detailed paragraph explaining why this email is dangerous.",
        "social_engineering_techniques": ["Technique 1 with description", "Technique 2 with description"],
        "indicators_of_compromise": ["IOC 1 (URL/Domain/IP)", "IOC 2"],
        "safety_recommendations": ["Recommendation 1", "Recommendation 2"],
        "mitre_mappings": [
            {{
                "id": "MITRE ATT&CK ID (e.g. T1566.002)",
                "name": "Technique Name",
                "description": "Short description of how it applies here."
            }}
        ]
    }}
    Do not output any markdown formatting outside of the JSON. Return raw JSON only.
    """

    # 1. Try Gemini API (Free, fast, direct HTTP call)
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json"
                }
            }
            response = requests.post(url, headers=headers, json=payload, timeout=8)
            if response.status_code == 200:
                res_data = response.json()
                text_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
                # Clean up any potential markdown wrap
                text_response = re.sub(r'^```json\s*|```$', '', text_response.strip(), flags=re.MULTILINE)
                return json.loads(text_response)
        except Exception as e:
            print(f"Gemini API call failed: {e}. Falling back to local analysis.")

    # 2. Try OpenAI API
    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key}"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a helpful cybersecurity assistant that outputs structured JSON."},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.2
            }
            response = requests.post(url, headers=headers, json=payload, timeout=8)
            if response.status_code == 200:
                res_data = response.json()
                text_response = res_data["choices"][0]["message"]["content"]
                return json.loads(text_response)
        except Exception as e:
            print(f"OpenAI API call failed: {e}. Falling back to local analysis.")

    # 3. Fallback to Local Expert System
    return generate_local_analysis(email_text, classification, indicators)
