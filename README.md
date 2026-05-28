# 🎓 Evently — Collegiate Event Management Platform

**Evently** is a state-of-the-art collegiate event management platform built to bridge the gap between students and event organizers. It enables students to discover and register for events and approved organizers to host and manage events seamlessly.

Featuring a dual-role registration system, an administrative approval workflow, real-time state synchronization, and an event lifecycle engine, **Evently** delivers a premium, highly responsive user experience.

---

## 🚀 Key Features & Custom Business Rules

1. **Dual Sign-up Toggle (`/register`)**:
   * Features a sliding toggle: **"I am an Attendee"** vs **"I am an Organizer"**.
   * **Attendees**: Requires Name, Email, and Password. Can register with *any* email domain (e.g., Gmail, Yahoo). Role is set to `'attendee'`.
   * **Organizers**: Requires Bennett email (strictly validated to end with `@bennett.edu.in`), Password, Organizing Body Name, and Designation. They are initially registered with the role `'pending_organizer'`.
   * **Required Indicator**: Explicit red `*` icons represent mandatory inputs in all forms.

2. **Organizer Approval & Secret Admin Dashboard (`/admin`)**:
   * Registered organizers have the `'pending_organizer'` role which allows event discovery but forbids event creation.
   * Master Admin account (`e23cseu0561@bennett.edu.in`) is automatically promoted to `'admin'` upon sign up or login.
   * Admins can access the secured **Admin Dashboard** (`/admin`) to view pending organizer accounts (complete with full designations and organizing bodies) and approve them in one click.

3. **Real-Time Login/Logout State Sync**:
   * Uses a custom global JS event (`window.dispatchEvent(new Event('auth-change'))`) on login and logout.
   * The `Navbar`, `Hero` header buttons, and `Events` page listen to this event to dynamically update the UI state and permissions in real-time without requiring page reloads.

4. **Event Duration Field & Form updates**:
   * The `Event` schema enforces a required `duration` string field (e.g., `"2 hours"`, `"Half Day"`).
   * Organizers/admins can specify duration in the creation modal, and it is displayed beautifully on both `EventCard` components and detail pages next to a clock icon.

5. **Dropdown Category Search Filter**:
   * Searching on the Events page uses a sleek `<select>` dropdown menu filtering the exact categories: `Academic`, `Tech and Innovation`, `Cultural & Entertainment`, `Festival`, and `Sports`.

6. **Past Events Lifecycle**:
   * Events older than one month ago are completely filtered out and removed from the page layout.
   * Events that occurred *within the last month* are beautifully grouped under a **"Past Events (Last 30 Days)"** section, while upcoming events are listed under **"Upcoming Events"**.

---

## 🛠️ Technology Stack & Architecture

Evently follows a **decoupled Client-Server (REST API)** architecture:

* **Frontend**: Next.js 15 (App Router, TypeScript, TailwindCSS v4, Lucide Icons, and React hooks).
* **Backend**: Node.js + Express.js + Mongoose + JWT Authentication + Multer (for image uploads).
* **Database**: MongoDB (Atlas).

---

## ⚙️ Configuration & Environment Variables

### Backend Configuration (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_signing_secret"
PORT=5001
```

### Frontend Configuration (`frontend/.env.local`)
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_BACKEND_URI="http://localhost:5001"
```

---

## 💻 Getting Started Locally

### 1. Install Dependencies
Run `npm install` in both the backend and frontend folders:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 2. Start the Development Servers
Open two terminal windows to run both services:

**Start Backend API Server (Port 5001):**
```bash
cd backend
npm run dev
```

**Start Frontend Next.js Client (Port 3000):**
```bash
cd frontend
npm run dev
```

---

## 🧪 Testing and Admin Credentials
To test the complete workflow (approving organizers and creating events):

1. Navigate to `/register` and sign up using the Master Admin email: **`e23cseu0561@bennett.edu.in`**.
2. Log in with this account. You will immediately see the **Admin** dashboard link in the navbar.
3. Register a new user as an **Organizer** (using an email ending with `@bennett.edu.in`).
4. Log in as the Admin, go to `/admin`, and click **"Approve Access"** on the newly registered organizer.
5. Log in as the approved organizer to see the **Create Event** button on both the Home page and Events list!
