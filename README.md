# 🚀 NEURA LINKS BOTS CLUB — AI Engineering & Progress Platform

> **NEURA LINKS BOTS CLUB** is a technical learning ecosystem, student progress tracking platform, and admin control dashboard designed for AI, Machine Learning, Deep Learning, Generative AI, and Agentic AI engineering. Live Production System.

---

## 🎨 Visual Aesthetics & Typography

Built with a dark aesthetic based on modern AI engineering platforms:
* **Headings & Titles**: `Playfair Display` (Serif)
* **Body, Controls & Code**: `Inconsolata` (Technical Monospace)
* **Background & Panels**: Deep pitch-dark (`#070709`) base with hairline glass cards (`#111116`), subtle purple/cyan neon highlights, and high-contrast typography.

---

## 🛠️ Technology Stack

### Frontend Framework & Styling
* **React 18** with **TypeScript**
* **Vite** (Next-generation build tool)
* **Tailwind CSS v4** + Custom Glassmorphism System
* **Lucide React** (Modern iconography)
* **Framer Motion** (Subtle micro-animations)
* **React Router DOM v6** (Protected role routing)

### Backend, Database & Storage
* **Firebase Authentication** (Google Auth Integration)
* **Firebase Firestore** (Real-time NoSQL Database for Users, Modules, Submissions, XP, Tasks, Analytics)
* **Firebase Storage** (PDFs, Notes, Project attachments)
* **Standalone Persistence Engine** (Pre-populated local storage sync provider for instant zero-config testing out of the box!)

---

## 👥 User Roles & Features

### 1. Student Experience
* **Personalized Dashboard** (`/dashboard`): Progress overview, level status, XP counter, current module quick-resume, today's focus priorities, upcoming deadlines, and activity stream.
* **Structured Learning Hub** (`/learning`, `/lesson/:id`): Levels 01 to 08 with video player embeds, markdown notes, code sandboxes, quiz questions, and a **"Mark as Complete (+XP)"** button.
* **Visual Interactive Roadmap** (`/roadmap`): Step-by-step master path from Python to AI Agents with node status indicators.
* **Tools Directory** (`/tools`): Categorized directory of AI tools (ChatGPT, Claude, Colab, LangChain, Hugging Face).
* **Resources Repository** (`/resources`): Downloadable study materials, PDFs, YouTube courses, cheat sheets, and research papers published by admins.
* **Tasks & Projects System** (`/tasks`): Interactive submission drawer for GitHub repository URLs, live application links, and implementation notes.
* **Student Competency Analysis Board** (`/analysis`):
  * Automated **Weak Area Detection** with targeted learning recommendations (e.g. *"Weakness: Agentic AI 30%"*).
  * Automated **Strength Highlights** (e.g. *"Top Strength: Git/GitHub 90%"*).
  * 10-domain skill breakdown bars & weekly XP activity charts.
* **Student Profile & Achievements** (`/profile`, `/notifications`): Badges grid, project showcase, level status, streak tracker, and student notifications.

### 2. Admin Control Center
* **Master Overview** (`/admin`): Overview cards (Registered Students, Active Members, Pending Submissions Queue, Published Modules).
* **Student Roster Management** (`/admin/students`): Search, filter, approve/block student access, and award custom XP bonuses.
* **Content Management System (CMS)** (`/admin/modules`, `/admin/resources`): Complete `CREATE → EDIT → DELETE → PUBLISH → UNPUBLISH` support for Levels, Modules, Lessons, Notes, Tools, and Resources.
* **Submission Evaluation Queue** (`/admin/submissions`): Code review drawer to inspect student GitHub repos and live apps. Actions: **`[ APPROVE (+XP) ]`**, **`[ REQUEST CHANGES ]`**, or **`[ REJECT ]`** with text feedback. Approving automatically awards XP and updates student competency analytics!
* **Announcements Broadcaster** (`/admin/announcements`): Broadcast club-wide notices.
* **Club Performance Analytics** (`/admin/analytics`): Overall completion rates and student metrics.

---

## 💻 How to Run the Application (Backend, Database & Frontend)

### Prerequisites
* **Node.js**: Version 18.0 or higher
* **npm**: Version 9.0 or higher
* **MongoDB Atlas Account**: Database cluster set up (or use default pre-configured cluster)

---

### Step 1: Install Project Dependencies

Open terminal in the project root directory (`Club`) and run:

```bash
# 1. Open terminal in project directory
cd Club

# 2. Install all dependencies (Frontend + Backend + Database drivers)
npm install
```

---

### Step 2: Seed MongoDB Atlas Database (First Time Setup)

To populate your **MongoDB Atlas** database with all initial Levels, Modules, Lessons, Tools, Tasks, Projects, Achievements, and Announcements, run from the root directory:

```bash
npm run seed
```

> **What this does**: Connects to your MongoDB Atlas cluster (`MONGODB_URI` specified in `.env`) and creates all initial database collections!

---

### Step 3: Run the Website (Backend + Frontend)

#### 🚀 Option A: Run Both Backend & Frontend Together (Recommended — Single Command)

Run this single command from your project root directory:

```bash
npm run dev:all
```

* **Backend Express Server & Socket.io**: Runs on 👉 **`http://localhost:5000`**
* **Frontend React & Vite Application**: Runs on 👉 **`http://localhost:5173`**

---

#### 🛠️ Option B: Run Backend and Frontend in Separate Terminals

If you want to view backend logs and frontend logs in separate windows:

* **Terminal 1 — Backend Server & Real-Time Sync**:
  ```bash
  npm run server
  ```

* **Terminal 2 — Frontend Application**:
  ```bash
  npm run dev
  ```

---

### Step 4: Instant Demo Role Credentials & Multi-Device Sync Testing

Open **`http://localhost:5173`** in your browser and click any quick demo option:

| Role | Demo Credentials | Capabilities |
| :--- | :--- | :--- |
| **Approved Student** | `naushad@neuralinks.club` | Full student dashboard access (Level 5 Generative AI, 1,840 XP, Tasks, Roadmap) |
| **Club Administrator** | `admin@neuralinks.club` | Full Admin CMS, Student Roster, Submission Review Drawer, & Announcements |
| **Unregistered User** | `guest@external.com` | Simulates security access denied screen |

#### 🔄 Testing Real-Time Teacher-Student Sync Across Devices:
1. Open **Browser 1** (Admin): Sign in as `admin@neuralinks.club`
2. Open **Browser 2 / Mobile** (Student): Sign in as `naushad@neuralinks.club`
3. Modify or publish any Module, Task, or Announcement in Browser 1.
4. **Notice**: MongoDB Atlas updates instantly and broadcasts via **Socket.io**, causing Browser 2 to update in real-time without reloading the page!

---

## ⚡ Environment Configuration (.env)

Your project configuration is located in the root file **.env**:

```env
# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@cluster0.example.mongodb.net/neuralinks?retryWrites=true&w=majority

# Express Backend Server Port
PORT=5000

# Firebase Authentication Configuration
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=club-b35f3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=club-b35f3
VITE_FIREBASE_STORAGE_BUCKET=club-b35f3.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1012598614314
VITE_FIREBASE_APP_ID=1:1012598614314:web:5eded22460f844f7439653
```

---

## 🏗️ Production Build & Verification

To create an optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

Output bundle files will be generated in the `dist/` directory.

---

## 📁 Project Directory Structure

```
Club/
├── .env                          # Environment variables (MongoDB URI & Firebase keys)
├── index.html                    # Entry HTML & Font preloads
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite build setup with Tailwind plugin
├── server/                       # Node.js Express + MongoDB Atlas Backend
│   ├── index.js                  # Express server & Socket.io real-time engine
│   ├── seedDatabase.js           # Database seeding script (npm run seed)
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas Mongoose connection
│   ├── models/
│   │   └── schemas.js            # Mongoose schemas for all entities
│   └── routes/
│       └── api.js                # REST API endpoints & Socket triggers
├── src/
│   ├── index.css                 # Global CSS theme & font rules
│   ├── firebase.ts               # Firebase Auth setup
│   ├── types/                    # TypeScript interfaces for platform models
│   ├── services/
│   │   └── apiService.ts         # MongoDB API & Socket.io client wrapper
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth provider & demo role switcher
│   │   └── DataContext.tsx       # State management connected to MongoDB Atlas
│   ├── data/
│   │   └── mockSeedData.ts       # Initial seed data for levels, modules & tasks
│   ├── components/               # UI components & navigation layouts
│   └── pages/                    # Student & Admin role pages
```

---

## 🛡️ License & Maintainer

Developed for **NEURA LINKS BOTS CLUB** • Controlled Student & Admin Ecosystem (2026).

