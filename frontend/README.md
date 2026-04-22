# 🚀 Infringe AI: Patent Infringement Module

# 📌 Overview

The Infringe Module is a high-performance, real-time AI engine within the Patsero ecosystem. It automates the extraction, mapping, and evidence gathering required for patent infringement analysis. Unlike traditional tools, it provides a human-in-the-loop interactive workflow and parallel bulk processing, turning weeks of research into minutes of automated work.

# --> Why this module?

Real-Time Intelligence: No page refreshes. UI updates instantly via WebSockets as AI tasks complete.

Scalable Research: Processes multiple patents and products simultaneously using a distributed worker architecture.

Evidence-Backed: Generates claim charts cited with live technical documentation from the web.

# 🛠 Tech Stack

# ====================== Frontend ==================================

Framework: React 18 (Functional Components, Hooks)

State Management: Redux Toolkit (RTK)

API/Data Fetching: RTK Query (Modular injectEndpoints architecture)

Real-Time: Socket.io-client (Event-driven UI updates)

Styling: Tailwind CSS (Patsero Premium Theme)

# ====================== Backend ==================================

Runtime: Node.js (ES Modules)

Framework: Express.js

Task Queue: BullMQ + Redis (Distributed background processing)

Real-Time Server: Socket.io (Push-based architecture)

Database: MongoDB (Mongoose ODM)

AI & External Services

LLM: Google Gemini 1.5 Pro & Flash (Patent logic & Mapping)

Search: Exa AI (Neural search for technical documentation)

Patent Data: SERP API (Structured Google Patents extraction)

Identity: Brandfetch API (Automatic company logo retrieval)

# --->🧭 Core Workflow Modes

1. # ⚡ Quick Mode (Automated)

Input a single Patent ID and receive a full analysis of the top 5 infringing products automatically.

2. # 🗂️ Bulk Mode (Parallel)

Submit a list of patents via manual entry or CSV/XLSX Upload. The system spawns independent workers for every patent, processing large batches in parallel.

3. # 🧠 Interactive Mode (Step-by-Step)

Phase 1: System extracts independent claims; User selects the primary claim.

Phase 2: AI generates a Claim-Spec mapping and discovers 50 potential companies.

Phase 3: User selects 1–3 high-priority targets.

Phase 4: Deep-dive evidence gathering and final chart generation.

# 🏗 Real-Time Architecture (The "Push" Engine)

To ensure the server remains stable under heavy AI load, this module uses a Non-Blocking Push Architecture:

Job Queuing: The API adds a task to BullMQ (Redis) and returns a 202 status.

Worker Execution: The Worker executes the AI/Search logic independently.

Socket Emission: As the worker finishes sub-tasks (e.g., "Found 50 companies"), it sends an event via Socket.io to a specific "Project Room."

Instant UI Update: The React frontend listens for these events and swaps the UI (e.g., hiding the loader and showing the selection grid) the exact millisecond the data is ready.

# 🚀 Installation & Setup

1. Environment Variables (.env)

Create a .env file in the backend/ directory:

code
Env
download
content_copy
expand_less
PORT=3001
MONGO_URI=your_mongodb_uri
REDIS_URL=redis://127.0.0.1:6379

# AI & API KEYS

GEMINI_API_KEY=your_key
SERP_API_KEY=your_key
EXA_API_KEY_1=your_key --> 5 key
BRANDFETCH_CLIENT_ID=your_key

# CENTRAL APP SYNC

PATSERO_BACKEND_URL=http://localhost:3000/api/v1
PATSERO_FRONTEND_URL=http://localhost:5174 2. Setup
code
Bash
download
content_copy
expand_less

# Install all dependencies

npm run install-all # or install manually in /backend and /frontend

# Start Redis (Required for Queue)

redis-server

# Start the Module

cd backend
npm run dev

# 📂 Project Structure

backend/jobs/: Core AI pipelines (Quick, Interactive, Mapping).

backend/workers/: BullMQ consumers handling concurrency and retries.

backend/utils/socket.js: WebSocket initialization and room management.

frontend/src/features/api/: Modular RTK Query slices (Patent, Interactive, Project).

frontend/src/components/interactive/: Logic-aware wizard components (Claims, Targets, Mapping).

# 🛡 Security & Performance

Socket Rooms: Users only receive updates for their own projects.

File Security: Bulk uploads undergo MIME-type validation and Formula/XSS sanitization.

Idempotency: Background jobs check database state before re-running AI prompts to save costs.

Lazy Loading: Modal components and Step-views are code-split to minimize initial bundle size.

Patsero Ecosystem • Infringe Module v1.0.0
