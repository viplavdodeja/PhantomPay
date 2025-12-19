# PhantomPay - AI Agent Invoice Tracker

## Overview

PhantomPay is an AI-powered invoice tracking and automated debt collection platform built as a university project demonstrating multi-agent AI systems. The application manages overdue invoices, uses AI agents to assess risk, select reminder strategies via reinforcement learning (epsilon-greedy bandit algorithm), and compose personalized payment reminder emails using OpenAI's gpt-4o-mini model.

**Core Purpose**: Demonstrate autonomous AI agent capabilities by intelligently deciding when to send email reminders versus initiating voice calls based on payment delay thresholds, customer history, and learned strategy effectiveness.

**Invoice Input Method**: PDF upload system (single or batch) automatically extracts invoice data (customer info, amounts, dates, line items) from uploaded invoices and creates both invoice and customer records in the database.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **December 2024**: AI Agent System Implementation
  - Risk assessment agent analyzes invoice/customer data
  - Strategy selection via epsilon-greedy bandit (exploration vs exploitation)
  - Email composition using OpenAI gpt-4o-mini model
  - Batch PDF upload for multiple invoices at once with progress tracking
  - All pages (Dashboard, Invoices, Customers) use TanStack React Query
  - Manual email and voice call triggers from invoice list
  - Twilio voice call integration with HTTPS webhooks

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for lightweight client-side routing without the overhead of React Router.

**UI Component System**: 
- **shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- Material Design principles for data-dense dashboard layouts
- Responsive design with mobile-first breakpoints (768px threshold)

**State Management**:
- **TanStack React Query** for all data fetching from REST API
- Local component state via React hooks for UI-only concerns

**Key Design Decisions**:
- Two-column forms on desktop collapse to single-column on mobile
- Color-coded invoice table rows based on overdue status (green=paid, amber/orange/red gradient for 1-7, 8-29, 30+ days overdue)
- Sticky headers for large data tables with virtual scrolling support (~500 rows)
- Dark mode toggle with localStorage persistence
- Batch PDF upload with progress indicator
- Email and phone buttons in invoice list for quick actions

### Backend Architecture

**Primary Database**: PostgreSQL via Neon serverless driver
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Tables**: customers, invoices, payments, events
- **Configuration**: `DATABASE_URL` environment variable
- **Schema**: Defined in `shared/schema.ts`
- **WebSocket**: Uses `ws` package for Neon serverless connection

**Express Server** (Node.js):
- Serves static Vite build in production
- Hosts REST endpoints for data CRUD, third-party integrations (AgentMail, Twilio, PDF uploads)
- PDF processing endpoint (`/api/upload-invoice-pdf`) using pdf-parse library

**API Endpoints**:
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get single invoice
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get single customer
- `POST /api/customers` - Create new customer
- `GET /api/events` - List all events
- `GET /api/payments` - List all payments
- `PATCH /api/invoices/:id/mark-paid` - Mark invoice as paid
- `POST /api/upload-invoice-pdf` - Upload and parse PDF invoice (single or batch)
- `POST /api/send-reminder` - Send email reminder
- `POST /api/voice-call` - Initiate voice call
- `POST /api/ai/process-overdue` - Run AI agent on overdue invoices
- `GET /api/ai/strategy-stats` - Get AI strategy performance stats

**AI Agent Decision Logic**:
1. **Risk Assessment**: Analyze customer payment history, invoice amount, days overdue
2. **Strategy Selection**: Epsilon-greedy bandit chooses between email strategies (gentle, firm, urgent, final_notice)
3. **Email Composition**: OpenAI gpt-4o-mini generates personalized email content
4. **Escalation**: Invoices >30 days overdue escalate to voice calls

### AI Integration

**OpenAI (gpt-4o-mini)**:
- **Purpose**: Generate personalized, context-aware payment reminder emails
- **Configuration**: `OPENAI_API_KEY` environment variable
- **Input**: Customer data, invoice details, risk assessment, selected strategy
- **Output**: Professional email subject and body tailored to situation

**Epsilon-Greedy Bandit Algorithm**:
- **Purpose**: Learn optimal reminder strategies over time
- **Exploration**: 10% chance to try random strategy
- **Exploitation**: 90% chance to use best-performing strategy
- **Strategies**: gentle_reminder, firm_reminder, urgent_notice, final_notice
- **Reward Signal**: Payment received after reminder = success

### External Dependencies

#### AgentMail (Email Service)
- **Purpose**: Send automated invoice reminder emails with AI-generated personalized content
- **API**: REST endpoints via `agentmail` npm package
- **Configuration**: 
  - `AGENTMAIL_API_KEY` for authentication
  - `TEST_EMAIL_OVERRIDE` for development redirects
  - Inbox: `reminder@phantompay.space`

#### Twilio Voice API
- **Purpose**: Make actual phone calls to customer phone numbers
- **Integration**: `twilio` npm package with Replit connector for credential management
- **Configuration**:
  - Managed via Replit Twilio connector (auto-handles API keys)
  - `TEST_PHONE_NUMBER` for development testing (overrides customer phone numbers)
  - Webhooks use HTTPS protocol (required by Twilio)

#### PDF Processing (pdf-parse)
- **Purpose**: Extract text and structured data from uploaded invoice PDFs
- **Processing Pipeline**:
  1. User uploads PDF(s) via dashboard (single or batch upload)
  2. Backend extracts raw text from each PDF
  3. Regex patterns parse invoice number, customer info, amounts, dates, line items
  4. PostgreSQL storage creates customer record (if new) and invoice record
  5. Dashboard refreshes with new invoice data
- **Supported Formats**: 
  - Standard invoice formats with fields like "Invoice #", "Bill To", "Due Date", "Total"
  - Both INV-2025-XXXX and invoice_#### numbering schemes
  - Table-based and list-based line item formats

#### Third-Party UI Libraries
- **Recharts**: Data visualization for monthly invoice totals and status breakdowns
- **date-fns**: Date formatting and manipulation
- **lucide-react**: Icon library (FileText, Users, Bell, Settings, etc.)
- **framer-motion**: Animation library for timeline events and transitions

### Key Architectural Tradeoffs

**PostgreSQL with Drizzle ORM**:
- **Chosen**: PostgreSQL via Neon serverless for full control and portability
- **Rationale**: Full ownership of data, standard SQL database, no vendor lock-in, type-safe queries

**AI Model (gpt-4o-mini)**:
- **Chosen**: OpenAI's gpt-4o-mini for email generation
- **Rationale**: Cost-effective, fast response times, sufficient quality for email composition

**Strategy Selection (Epsilon-Greedy Bandit)**:
- **Chosen**: Simple bandit algorithm for strategy learning
- **Rationale**: Balances exploration of new strategies with exploitation of known good ones
- **Alternative**: Full reinforcement learning (overkill for 4 strategies)

**Fail-Closed Security**:
- **Design**: AI endpoints require `AI_API_KEY` environment variable
- **Rationale**: Prevents accidental API calls without proper credentials

### Development Notes

- **Vite WebSocket HMR errors**: Browser console shows WebSocket connection errors - these are Replit development environment issues, not application bugs
- **Database**: Uses Neon serverless PostgreSQL with `ws` package for WebSocket polyfill
- **Twilio webhooks**: Must use HTTPS protocol for webhook URLs (Twilio requirement)
- **Environment variables**: Server restart required after changing env vars (loaded at module init)
