PhantomPay 💸

AI-Powered Invoice Risk Scoring & Intelligent Payment Reminders

PhantomPay is an AI-driven SaaS prototype designed to help businesses reduce late payments by predicting invoice risk and sending smart, personalized payment reminders. Instead of static follow-ups, PhantomPay adapts its strategy based on customer behavior, invoice history, and reinforcement learning feedback.

This project was built as both a technical exploration of applied AI and a product-focused MVP suitable for early-stage validation, hackathons, and accelerators.

🚀 Key Features

Invoice Risk Scoring

Predicts likelihood of late or missed payments

Uses historical invoice behavior and metadata

Reinforcement Learning Reminder Strategy

Multi-armed bandit (ε-greedy) approach

Learns optimal reminder timing and tone

LLM-Generated Payment Emails

Personalized, context-aware reminders

Generated using GPT-4o-mini

Explainable Decision Logic

Transparent scoring and reminder selection

Designed for business trust and auditability

Modular SaaS-Ready Architecture

Easily extensible to dashboards, CRMs, and billing systems

🧠 How It Works (High Level)

Invoice Ingestion

Invoice data is collected (amount, due date, customer history, etc.)

Risk Scoring

ML model assigns a risk score (low → high)

Strategy Selection

Reinforcement learning agent selects a reminder strategy

Email Generation

LLM generates a tailored reminder email

Feedback Loop

Payment outcome updates the agent’s learning policy

🏗️ Tech Stack

Backend

Python

FastAPI

SQL (MySQL / SQLite for prototyping)

AI / ML

GPT-4o-mini (email generation)

Reinforcement Learning (ε-greedy multi-armed bandit)

Classical ML models (logistic regression / tree-based experiments)

Data

Structured invoice schemas

Feature-engineered payment history

Dev & Prototyping

VS Code / Replit

GitHub

Hackathon-friendly architecture

📂 Project Structure (Example)
phantomp ay/
├── app/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── agents/
├── data/
│   ├── invoices.csv
│   └── customers.csv
├── notebooks/
│   └── experiments.ipynb
├── README.md
└── requirements.txt

📊 Example Use Cases

Small businesses chasing overdue invoices

Finance teams prioritizing follow-ups

SaaS billing platforms adding AI-powered collections

Hackathon demos showcasing applied RL + LLMs

🧪 Current Status

✅ MVP prototype

✅ Risk scoring + RL logic implemented

✅ LLM email generation integrated

🔄 Dashboard & production hardening (in progress)

🔮 Future Improvements

Customer segmentation & clustering

Time-series payment forecasting

CRM integrations (Stripe, QuickBooks, Xero)

Fine-tuned LLMs for tone control

Multi-tenant SaaS deployment

A/B testing framework for reminder strategies

👤 Author

Viplav Dodeja
Undergraduate CS Student | AI/ML & Product Engineering
📍 San Francisco Bay Area

LinkedIn: (add link)

Portfolio: https://sites.google.com/view/viplav-portfolio/home

📜 License

This project is released under the MIT License.
Feel free to use, fork, and build upon it.
