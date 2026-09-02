# n8n Automation Workflow Setup

## Overview

This document explains how to set up the n8n automation workflow for the AI Service Assistant. The workflow receives service cases via webhook, checks urgency level, and sends notifications to Service Advisors.

## Workflow Diagram

```
Webhook Trigger → Check Urgency → [HIGH] → Send Urgent Notification → Respond
                                 → [MEDIUM/LOW] → Send Normal Notification → Respond
```

## Prerequisites

- n8n instance (Cloud or self-hosted via Docker)
- Notification channel configured (Discord, LINE, or Email)

## Option 1: n8n Cloud

1. Sign up at https://n8n.io
2. Create a new workflow
3. Follow the node setup instructions below

## Option 2: Self-hosted (Docker)

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  n8nio/n8n
```

Access n8n at http://localhost:5678

## Workflow Setup (Step-by-Step)

### Node 1: Webhook Trigger

1. Add a **Webhook** node
2. Set HTTP Method to **POST**
3. Set Path to `/vehicle-service-case`
4. Copy the **Production URL** (e.g., `https://your-n8n.app.n8n.cloud/webhook/vehicle-service-case`)
5. Set this URL as `N8N_WEBHOOK_URL` in your server's `.env` file
6. Set Response Mode to **Last Node**

### Node 2: IF Node (Check Urgency)

1. Add an **IF** node connected to the Webhook
2. Set condition:
   - Value 1: `{{ $json.urgency }}`
   - Operation: **equals**
   - Value 2: `HIGH`

### Node 3a: HIGH Priority — Send Urgent Notification

Connect this to the **true** output of the IF node.

#### Option A: Discord Webhook

1. Add an **HTTP Request** node
2. Set Method: **POST**
3. URL: Your Discord webhook URL
4. Body Content Type: **JSON**
5. Body:
```json
{
  "content": "🚨 **HIGH PRIORITY Vehicle Service Case**\n\n**Customer:** {{ $json.customerName }}\n**Phone:** {{ $json.phoneNumber }}\n**Vehicle:** {{ $json.vehicleModel }} {{ $json.vehicleYear }}\n**Category:** {{ $json.category }}\n**Urgency:** 🔴 HIGH\n\n**Problem Summary:**\n{{ $json.summary }}\n\n**Recommendation:**\n{{ $json.recommendation }}\n\n⚠️ กรุณาตรวจสอบ Case นี้โดยเร็ว\n**Case ID:** {{ $json.caseId }}"
}
```

#### Option B: LINE Notify

1. Add an **HTTP Request** node
2. Method: **POST**
3. URL: `https://notify-api.line.me/api/notify`
4. Headers: `Authorization: Bearer YOUR_LINE_TOKEN`
5. Body Content Type: **Form-Urlencoded**
6. Body Parameter:
   - `message`: `\n🚨 HIGH PRIORITY\nCustomer: {{ $json.customerName }}\nVehicle: {{ $json.vehicleModel }}\nCategory: {{ $json.category }}\nUrgency: HIGH\nSummary: {{ $json.summary }}`

#### Option C: Email (Gmail SMTP)

1. Add a **Send Email** node
2. Configure Gmail credentials in n8n
3. To: service-advisor@company.com
4. Subject: `🚨 HIGH Priority: {{ $json.category }} - {{ $json.customerName }}`
5. Body:
```
🚨 High Priority Vehicle Service Case

Customer: {{ $json.customerName }}
Phone: {{ $json.phoneNumber }}
Vehicle: {{ $json.vehicleModel }} {{ $json.vehicleYear }}
Category: {{ $json.category }}
Urgency: HIGH

Problem Summary:
{{ $json.summary }}

Recommendation:
{{ $json.recommendation }}

Please review this case immediately.
Case ID: {{ $json.caseId }}
```

### Node 3b: MEDIUM/LOW Priority — Send Normal Notification

Connect this to the **false** output of the IF node.

Same structure as above but with a non-urgent format:

#### Discord Example:
```json
{
  "content": "📋 **New Vehicle Service Case**\n\n**Customer:** {{ $json.customerName }}\n**Vehicle:** {{ $json.vehicleModel }} {{ $json.vehicleYear }}\n**Category:** {{ $json.category }}\n**Urgency:** {{ $json.urgency }}\n\n**Summary:** {{ $json.summary }}\n\n**Case ID:** {{ $json.caseId }}"
}
```

### Node 4: Respond to Webhook

1. Add a **Respond to Webhook** node at the end of both paths
2. Response Code: 200
3. Body:
```json
{
  "success": true,
  "message": "Notification sent"
}
```

## Webhook Payload Schema

The backend sends this JSON payload to the webhook:

```json
{
  "caseId": "uuid-string",
  "customerName": "Taksin",
  "phoneNumber": "081-234-5678",
  "vehicleModel": "Honda Civic",
  "vehicleYear": 2023,
  "category": "Brake",
  "urgency": "HIGH",
  "summary": "ลูกค้าแจ้งว่าเบรกมีเสียงดัง...",
  "recommendation": "กรุณานำรถเข้าตรวจสอบ...",
  "requiresImmediateAttention": true,
  "status": "NEW",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Discord Webhook Setup

1. Open Discord → Server Settings → Integrations → Webhooks
2. Click **New Webhook**
3. Name: `AI Service Assistant`
4. Select the channel for notifications
5. Copy the Webhook URL
6. Use this URL in the n8n HTTP Request node

## Testing

1. Activate the workflow in n8n
2. Submit a test case through the web application
3. Check n8n execution log for success
4. Verify notification was received

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook not receiving | Check N8N_WEBHOOK_URL in .env matches n8n's Production URL |
| 404 error | Ensure workflow is **activated** in n8n |
| Notification not sent | Check Discord/LINE/Email credentials in n8n |
| Connection refused | Ensure n8n is running and accessible from your server |
