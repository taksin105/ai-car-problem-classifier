# 🚗 AI Service Assistant

## AI-powered Vehicle Problem Classification & Service Automation

An intelligent web application that helps Service Advisors at automotive service centers by using AI to analyze customer-reported vehicle symptoms, classify problems, assess urgency, generate service reports, and automate notification workflows.

> **Built as a Portfolio Project** demonstrating expertise in AI integration, automation workflows, and full-stack development.

![Tech Stack](https://img.shields.io/badge/React-TypeScript-blue) ![Backend](https://img.shields.io/badge/Node.js-Express-green) ![AI](https://img.shields.io/badge/Google-Gemini_AI-orange) ![DB](https://img.shields.io/badge/Firebase-Firestore-yellow) ![Automation](https://img.shields.io/badge/n8n-Automation-red)

---

## 📋 Table of Contents

- [Business Problem](#-business-problem)
- [Solution](#-solution)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [AI Workflow](#-ai-workflow)
- [Automation Workflow](#-automation-workflow)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Firebase Setup](#-firebase-setup)
- [Gemini API Setup](#-gemini-api-setup)
- [n8n Setup](#-n8n-setup)
- [API Documentation](#-api-documentation)
- [Demo Instructions](#-demo-instructions)
- [Future Improvements](#-future-improvements)

---

## 🎯 Business Problem

When customers report vehicle issues via chat or other channels, Service Advisors must:
1. Read and understand the problem details
2. Analyze symptoms manually
3. Categorize the problem type
4. Assess urgency level
5. Forward information to relevant personnel

This process is **time-consuming**, **inconsistent**, and **error-prone** — especially during peak hours.

## 💡 Solution

This system automates the entire intake workflow:

```
Customer reports problem → AI analyzes & classifies → Urgency assessed →
Service report generated → Saved to database → Automation triggered →
Service Advisor notified
```

**Result:** Reduced intake time from ~10 minutes to under 30 seconds per case.

## ✨ Features

### Core Features
- **AI-Powered Analysis** — Gemini AI analyzes vehicle symptoms and classifies problems
- **Smart Classification** — 11 problem categories (Engine, Brake, Transmission, etc.)
- **Urgency Assessment** — 3-level urgency system (LOW, MEDIUM, HIGH)
- **Automated Notifications** — HIGH priority cases trigger immediate alerts
- **Service Advisor Dashboard** — Real-time case management with search & filters
- **Automation Logging** — Complete audit trail of all automation events

### UI Features
- Modern, professional SaaS dashboard design
- Loading states, error handling, empty states
- Toast notifications
- Responsive design
- Color-coded urgency and status badges

---

## 🏗 System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  React Frontend │────▶│  Express Backend  │────▶│  Gemini AI  │
│  (Vite + TS)    │◀────│  (Node.js + TS)   │◀────│  (Analysis) │
└─────────────────┘     └────────┬─────────┘     └─────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼                         ▼
           ┌──────────────┐          ┌──────────────┐
           │   Firestore   │          │  n8n Webhook │
           │  (Database)   │          │ (Automation) │
           └──────────────┘          └──────┬───────┘
                                            │
                                    ┌───────┴───────┐
                                    ▼               ▼
                              HIGH Priority   Normal Priority
                              🚨 Urgent       📋 Standard
                              Notification    Notification
                                    │               │
                                    └───────┬───────┘
                                            ▼
                                    Service Advisor
```

## 🤖 AI Workflow

1. **Input** — Customer name, vehicle info, problem description
2. **Processing** — Gemini AI with structured JSON output schema
3. **Output:**
   - Problem category (from 11 predefined categories)
   - Urgency level (LOW / MEDIUM / HIGH)
   - Confidence score (0-1)
   - Symptoms extraction
   - Possible causes
   - Follow-up questions (in Thai)
   - Recommendation (in Thai)

> ⚠️ **Disclaimer:** AI provides initial triage only, not a mechanical diagnosis.

## 🔄 Automation Workflow (n8n)

```
Webhook receives case → Check urgency level
  → HIGH: Send urgent notification (🚨)
  → MEDIUM/LOW: Send normal notification (📋)
```

Supported notification channels:
- Discord Webhook
- LINE Notify
- Email (Gmail SMTP)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5, TypeScript |
| AI | Google Gemini API (gemini-2.0-flash) |
| Database | Firebase Firestore |
| Automation | n8n (webhook-based) |
| API | REST |

## 📁 Project Structure

```
AI Car Problem Classifier/
├── client/                    # React Frontend
│   └── src/
│       ├── components/
│       │   ├── ui/            # Badge, Card, Spinner, Toast, etc.
│       │   └── layout/        # Sidebar, Layout
│       ├── pages/             # Dashboard, CustomerInput, CaseDetail, AutomationLog
│       ├── services/          # API client
│       └── types/             # TypeScript interfaces
├── server/                    # Node.js Backend
│   └── src/
│       ├── config/            # Firebase, Gemini, Environment
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Validation, Error handling
│       ├── prompts/           # AI system prompt
│       ├── routes/            # API routes
│       ├── services/          # Business logic
│       └── types/             # TypeScript interfaces
├── n8n/                       # Automation documentation
├── README.md
└── .gitignore
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Firestore enabled
- Google AI Studio API key
- n8n instance (optional, for automation)

### 1. Clone the repository
```bash
git clone <repository-url>
cd AI\ Car\ Problem\ Classifier
```

### 2. Install Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 3. Install Frontend
```bash
cd client
npm install
```

### 4. Start Development

**Backend** (Terminal 1):
```bash
cd server
npm run dev
```
Server starts at http://localhost:5000

**Frontend** (Terminal 2):
```bash
cd client
npm run dev
```
App opens at http://localhost:5173

### 5. Seed Demo Data (Optional)
```bash
cd server
npm run seed
```

## ⚙️ Environment Variables

Create `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/vehicle-service-case
```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Cloud Firestore** (start in test mode for development)
4. Go to **Project Settings → Service Accounts**
5. Click **Generate New Private Key**
6. Copy `project_id`, `client_email`, and `private_key` to your `.env`

## 🧠 Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click **Get API Key**
3. Create a new key or use existing
4. Copy the key to `GEMINI_API_KEY` in your `.env`

> Free tier provides sufficient quota for demo purposes.

## 🔧 n8n Setup

See [n8n Workflow Documentation](./n8n/workflow-documentation.md) for detailed setup instructions.

## 📡 API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze vehicle problem with AI |
| GET | `/api/cases` | List all cases (with search/filter) |
| GET | `/api/cases/stats` | Dashboard statistics |
| GET | `/api/cases/:id` | Get single case details |
| PATCH | `/api/cases/:id/status` | Update case status |
| GET | `/api/automation-logs` | Get all automation logs |
| GET | `/api/automation-logs/:caseId` | Get logs for specific case |
| GET | `/api/health` | Health check |

### POST /api/analyze — Example

**Request:**
```json
{
  "customerName": "Taksin",
  "phoneNumber": "081-234-5678",
  "vehicleModel": "Honda Civic",
  "vehicleYear": 2023,
  "mileage": 45000,
  "problemDescription": "เวลาเหยียบเบรกมีเสียงดังและรู้สึกว่าเบรกไม่ค่อยอยู่"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "category": "Brake",
    "urgency": "HIGH",
    "confidence": 0.93,
    "summary": "ลูกค้าแจ้งว่าเบรกมีเสียงดังและประสิทธิภาพการเบรกลดลง",
    "symptoms": ["Brake noise", "Reduced braking performance"],
    "possibleCauses": ["Worn brake pads", "Warped brake rotors"],
    "followUpQuestions": ["เสียงเกิดขึ้นทุกครั้งที่เบรกหรือไม่?"],
    "recommendation": "กรุณาหยุดใช้งานรถและนำรถเข้าตรวจสอบทันที",
    "requiresImmediateAttention": true,
    "status": "NEW",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎬 Demo Instructions

### Demo Flow (~3-5 minutes)

1. **Open the app** → Navigate to "New Case"
2. **Enter customer data:**
   - Name: `Taksin`
   - Phone: `081-234-5678`
   - Vehicle: `Honda Civic` / 2023 / 45,000 km
   - Problem: `เวลาเหยียบเบรกมีเสียงดังและรู้สึกว่าเบรกไม่ค่อยอยู่`
3. **Click "Analyze Problem"** → Watch AI analysis loading
4. **View AI Results** → Category: Brake, Urgency: HIGH
5. **Check Dashboard** → New HIGH priority case appears at top
6. **Open Case Details** → View full analysis + automation timeline
7. **Check Automation Logs** → See complete automation pipeline
8. **Check Discord/Email** → Service Advisor received notification
9. **Update Status** → Change from NEW to IN_REVIEW

### Key Talking Points
- "AI processes customer input in seconds vs. manual triage taking minutes"
- "Urgent cases automatically trigger notifications — no manual monitoring needed"
- "Complete audit trail shows every automation step for transparency"
- "System classifies across 11 problem categories with confidence scoring"

## 🔮 Future Improvements

- 🎤 **Voice Input** — Let customers describe problems by speaking
- 📸 **Image Analysis** — Analyze dashboard warning light photos
- 📱 **LINE Official Account** — Integration with LINE messaging
- 📅 **Appointment Booking** — Schedule service appointments
- 📊 **Service History** — Track vehicle service records
- 🔗 **Vehicle Database** — Link customer vehicle data
- 🧠 **AI Knowledge Base** — Enhanced analysis with service manuals
- 📈 **Analytics Dashboard** — Trends, patterns, and KPIs
- 🏢 **Multi-branch** — Support multiple service centers
- 🔐 **Role-based Access** — Different permissions for staff roles

---

## 📄 License

MIT License

---

**Built with ❤️ as a Portfolio Project for Automation & AI Workflow**
