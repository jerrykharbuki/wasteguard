# WasteGuard AI — Frontend

React + Vite web application for AI-assisted waste-dumping detection and reporting.

## Pages / Routes

| Route | Description |
|---|---|
| `/login` | Sign in (redirects authorities to `/admin`) |
| `/register` | Create a user account |
| `/dashboard` | User home + recent reports (protected) |
| `/report` | Live camera detection + report submission (protected) |
| `/admin` | Authority dashboard: map, incident table, review (authority only) |

## Project layout

```
src/
  components/
    common/      Navbar, Sidebar, Footer, Button, Loading
    auth/        Login, Register, ProtectedRoute
    dashboard/   Dashboard, ReportCard, RecentReports
    camera/      CameraView, DetectionStatus, CaptureButton
    reporting/   ReportForm, ImagePreview, LocationPicker
    admin/       AdminDashboard, IncidentTable, IncidentDetails, StatusBadge
    map/         IncidentMap
  context/       AuthContext (shared auth state)
  hooks/         useAuth, useCamera
  pages/         AppLayout, LoginPage, RegisterPage, DashboardPage, ReportPage, AdminDashboardPage
  routes/        index.jsx (React Router config)
  services/      firebase, authService, firestoreService, storageService, aiService
  App.jsx        entry component
  main.jsx       React root
  index.css      global Emerald theme styles
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your Firebase web app and copy the config to a `.env.local` file
   (copy from `.env.example`):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_BACKEND_URL=http://localhost:8000
   ```
   > Never commit `.env.local`. It is ignored by git.

3. (Optional) Enable Email/Password auth and Firestore in the Firebase console.

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open the printed URL (default http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Data flow (important)

- Camera frames are sent to the **AI backend** (`aiService.js` → FastAPI), NOT to Firebase.
- Only **selected evidence images** are uploaded to Firebase Storage.
- Only **report summaries** (title, description, GPS, evidence URLs, status) go to Firestore.
- AI detections are **suspected incidents** — authorities must review before any action.