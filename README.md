<h1 align="center">
  <br>
  💡 FinAI - Personal AI Financial Assistant
  <br>
</h1>

<h4 align="center">A Next-Generation Personal Finance Platform powered by Artificial Intelligence 🚀</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a>
</p>

---

## ✨ Features

- 📊 **Smart Dashboard**: A beautifully designed, live dashboard showing your income, expenses, total balance, savings rate, and weekly spending trends.
- 🤖 **AI Financial Insights**: Get deep AI analysis of your spending habits, category trends, and highly personalized financial advice.
- 💸 **Expense Tracker**: Easily add your expenses, categorized dynamically, and monitor your distribution via interactive donut charts.
- 🎯 **Advanced Budgeting**: Set monthly limits per category and track your progress. The AI Advisor identifies irregularities and proactively sends tips.
- 🛡️ **Fraud Detection Alerts**: Stay protected with real-time alerts flagging suspicious activities, unverified merchants, or out-of-pattern spending based on AI evaluation.
- 🧾 **Live Transactions**: A fast, filterable, and unified log of your financial ledger.
- 🎨 **Premium UI/UX**: Dark mode by default, built with sleek gradients, glassmorphism elements, micro-animations, and a responsive layout.

## 💻 Tech Stack

### Frontend (`finance-dashboard`)
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Directory Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/) (Icons)
- **Charts**: [Recharts](https://recharts.org/)
- **Authentication & Database**: [Firebase](https://firebase.google.com/) (Auth, Firestore)
- **Deployment**: Firebase Hosting / Vercel

### Backend (`finance-backend`)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI/ML**: Powered by HuggingFace / OpenAI integration for predictive analytics and advisors.
- **Data Integration**: Firebase Admin SDK
- **Deployment**: Render / Google Cloud

## 📂 Architecture & Project Structure

The project is structured as a monorepo containing both the frontend and backend.

```text
AI-FINANCE-PLATFORM/
├── finance-dashboard/      # Next.js Frontend Application
│   ├── app/                # Next.js App Router pages (dashboard, expenses, budgets, etc.)
│   ├── components/         # Reusable UI components (charts, layout, finance tools)
│   ├── context/            # Global state (Auth, Search)
│   ├── lib/                # API Services, Firebase config, Utilities
│   └── public/             # Static assets
│
└── finance-backend/        # FastAPI Python Backend
    ├── app/
    │   ├── ai/             # AI prediction & processing logic
    │   ├── api/            # API routing & endpoints
    │   ├── models/         # Database schemas
    │   └── services/       # Core backend business logic
    ├── Dockerfile          # Docker setup for deployment
    └── requirements.txt    # Python dependencies
```

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher)
- A Firebase Project (with Auth & Firestore enabled)

### 1. Clone the repository
```bash
git clone https://github.com/prashantkumar3088/AI-FINANCE-PLATFORM.git
cd AI-FINANCE-PLATFORM
```

### 2. Setup the Frontend
```bash
cd finance-dashboard
npm install

# Create a .env.local file with your Firebase credentials
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev
```
The Next.js dashboard will be running at `http://localhost:3000`.

### 3. Setup the Backend
```bash
cd ../finance-backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Create a .env file and add any required API keys

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
The FastAPI backend will be listening at `http://localhost:8000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 

## 📝 License
This project is licensed under the [MIT License](LICENSE).

---
<p align="center">Made with ❤️ by the FinAI Team.</p>
