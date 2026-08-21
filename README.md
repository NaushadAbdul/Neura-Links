# 🚀 NEURA LINKS BOTS CLUB — AI Engineering & Progress Platform

> **NEURA LINKS BOTS CLUB** is a technical learning ecosystem, student progress tracking platform, and admin control dashboard designed for AI, Machine Learning, Deep Learning, Generative AI, and Agentic AI engineering.

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

## 💻 How to Run the Application

### Prerequisites
* **Node.js**: Version 18.0 or higher
* **npm**: Version 9.0 or higher

---

### Step 1: Clone & Install Dependencies

Navigate to the project root directory and install all required packages:

```bash
# 1. Open terminal in project directory
cd Club

# 2. Install dependencies
npm install
```

---

### Step 2: Start Local Development Server (Frontend + Demo Engine)

Run the Vite local development server:

```bash
npm run dev
```

The application will start immediately at:
👉 **`http://localhost:5173/`**

> **Note**: The application is pre-configured with complete mock seed data and persistence out of the box, allowing instant testing without requiring external credentials up front!

---

### Step 3: Instant Demo Role Credentials

On the Opening Screen (`/login`), click any quick demo option:

| Role | Demo Credentials | Description |
| :--- | :--- | :--- |
| **Approved Student** | `naushad@neuralinks.club` | Full student dashboard access (Level 5 Generative AI, 1,840 XP) |
| **Club Administrator** | `admin@neuralinks.club` | Full admin CMS control panel, student roster, & review queue |
| **Unregistered User** | `guest@external.com` | Simulates denied security screen for unauthorized accounts |

---

## ⚡ Connecting Real Firebase Backend (Optional)

To connect the application to your production Firebase project for real Google Authentication, Firestore Database, and Storage:

### 1. Create `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Enable Firebase Services in Firebase Console:
1. **Authentication**: Enable Google Provider in `Build > Authentication > Sign-in method`.
2. **Firestore Database**: Create database in production mode.
3. **Storage**: Enable Firebase Storage bucket for files.

---

## 🏗️ Production Build & Verification

To create an optimized production build:

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
├── index.html                    # Fonts (Inconsolata, Playfair Display), metadata
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite build setup with Tailwind plugin
├── src/
│   ├── index.css                 # Global CSS theme & font rules
│   ├── firebase.ts               # Firebase Auth, Firestore & Storage config
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces for platform models
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth provider & demo role switcher
│   │   └── DataContext.tsx       # Centralized state & CRUD operations
│   ├── data/
│   │   └── mockSeedData.ts       # Initial seed data for levels, modules & tasks
│   ├── components/
│   │   ├── common/               # Card, Modal, ProgressBar, Badge, SearchBar
│   │   └── layout/               # Navbar, Sidebar, MobileNav
│   └── pages/
│       ├── Landing.tsx           # Landing/Login page
│       ├── Unauthorized.tsx      # Security access denied screen
│       ├── student/              # Dashboard, Learning, Tools, Resources, Roadmap, Tasks, Analysis, Profile, Notifications
│       └── admin/                # AdminDashboard, StudentMgmt, ContentCMS, ResourcesCMS, RoadmapCMS, TasksProjectsCMS, SubmissionsReview, AchievementsCMS, AnnouncementsCMS, AdminAnalytics
```

---

## 🛡️ License & Maintainer

Developed for **NEURA LINKS BOTS CLUB** • Controlled Student & Admin Ecosystem (2026).
