# QuickJudge V2.0

QuickJudge V2.0 is a full-stack coding contest platform built with a React frontend and an Express + MySQL backend. The project currently covers authentication, contest browsing, contest details, protected contest access, and student-facing contest flows.

## Tech Stack

- Frontend: Vite, React 19, Redux Toolkit, React Router DOM, Tailwind CSS v4
- Backend: Express 5, MySQL, JWT, bcrypt
- Tooling: ESLint, Prettier

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- npm
- MySQL

## Installation

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Backend Environment

Create or update `backend/.env` with values like these:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=""
DB_NAME=quickjudge
JWT_SECRET=change_this_secret
FRONTEND_URL=http://localhost:5173
```

## Database Setup

Open XAMPP, go to phpMyAdmin, and import `Database/quickjudge.sql`.

## Running the App

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal from the project root:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Task and Sub-Task Tree

### Task: Student Profile Page

```text
Student Profile Page
|-- Overview
|-- Activity Records
|-- Profile Description
|-- Problem Breakdown
|-- Achievements
|-- Submission Heatmap
|-- Submission
|   `-- List of Submissions
|-- Activity
|   `-- Activity Feed
`-- Contests
    `-- List of Participated Contests
```

### Task: Admin Create Contest Page

```text
Admin Create Contest Page
|-- Basic Information
|   |-- Title
|   `-- Description
|-- Schedule
|   |-- Start Time
|   `-- End Time
|-- Problems
|   `-- Select Problems
`-- Visibility
    |-- Public Contest
    `-- Private Contest with Password
```

## Frontend Structure

```text
src/
|-- app/
|   `-- store.js
|-- components/
|   |-- common/
|   `-- layout/
|-- features/
|   |-- auth/
|   |   |-- components/
|   |   |-- authApi.js
|   |   |-- authSelectors.js
|   |   |-- authSlice.js
|   |   `-- authThunks.js
|   |-- contests/
|   |   |-- components/
|   |   |   |-- contestDetails/
|   |   |   |-- ContestFilterBar.jsx
|   |   |   |-- ContestListCard.jsx
|   |   |   |-- ContestPasswordModal.jsx
|   |   |   |-- ContestSection.jsx
|   |   |   |-- ContestSectionTitle.jsx
|   |   |   |-- PastContestRow.jsx
|   |   |   `-- PastContestTable.jsx
|   |   |-- contestsApi.js
|   |   |-- contestsSelectors.js
|   |   |-- contestsSlice.js
|   |   `-- contestsThunks.js
|   `-- problems/
|       `-- components/
|           |-- ProblemDifficultyBadge.jsx
|           |-- ProblemStatusDot.jsx
|           `-- ProblemTitleLink.jsx
|-- pages/
|   |-- public/
|   |   |-- LandingPage.jsx
|   |   |-- LoginPage.jsx
|   |   `-- SignupPage.jsx
|   `-- student/
|       `-- contests/
|           |-- ContestAnnouncementsPage.jsx
|           |-- ContestLayoutPage.jsx
|           |-- ContestLeaderboardPage.jsx
|           |-- ContestPage.jsx
|           |-- ContestProblemsPage.jsx
|           |-- ContestQueriesPage.jsx
|           |-- ContestSubmissionsPage.jsx
|           `-- PastContestsPage.jsx
|-- routes/
|   `-- AppRouter.jsx
|-- styles/
|   `-- index.css
|-- App.jsx
`-- main.jsx
```

## Backend Structure

```text
backend/src/
|-- config/
|   `-- db.js
|-- controllers/
|   |-- auth.controller.js
|   `-- contest.controller.js
|-- middleware/
|   `-- auth.middleware.js
|-- routes/
|   |-- auth.routes.js
|   `-- contest.routes.js
|-- services/
|   `-- contest.service.js
|-- utils/
|   `-- response.js
|-- validators/
|   `-- contest.validator.js
`-- server.js
```
