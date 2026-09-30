# WasteGuard AI — Authority Portal (Admin App)

A **separate** React + Vite application for authorities/administrators to
log in and manage reports submitted through the WasteGuard AI **user app**.

> This app is independent of the user frontend and the Python AI model.
> It reads and updates the **same Firebase project** so authorities can
> see the reports users submit.

## What it does

- Admin login (Firebase Auth), restricted to accounts with role `authority`.
- Dashboard with statistics: total, pending, resolved, rejected reports.
- Reports table of all user submissions.
- Per-report detail page with evidence image, map, and status updates.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. The Firebase config is already in `.env` (points to the same project as
   the user app). Do not commit `.env` if you change the values.

3. Run the app
   ```bash
   npm run dev
   ```
   It runs on **http://localhost:5175** (separate from the user app).

## Making an admin account

1. Log in to Firebase console → your project → Firestore.
2. The `users` collection holds one document per user keyed by `uid`.
3. Set `role: "authority"` on the desired user's document.
4. That account can now sign in to this admin app.

## Firestore data model (reused from the user app)

Reports are stored in the `incidents` collection (the admin app does **not**
create a new collection):

```js
{
  id: "<firestore doc id>",
  title: "Bags dumped near riverbank",
  wasteType: "Household waste",       // optional
  description: "...",
  location: { lat: 14.60, lng: 121.05 },
  evidenceImages: ["https://..."],
  status: "pending" | "resolved" | "rejected",  // ("verified" also possible)
  reporterName: "Maria Santos",
  reportedBy: "<user uid>",
  createdAt: <Timestamp>,
  updatedAt: <Timestamp>
}
```

## File guide

| File | Purpose |
|---|---|
| `src/firebase/firebase.js` | Initializes Firebase (same project as user app). |
| `src/services/authService.js` | Admin login/logout + role check. |
| `src/services/reportService.js` | Fetch reports & update status in Firestore. |
| `src/context/AuthContext.jsx` | Holds `{ user, isAdmin, loading }` app-wide. |
| `src/components/ProtectedRoute.jsx` | Blocks non-authorities; redirects to `/login`. |
| `src/components/Sidebar.jsx` | Navigation menu. |
| `src/components/Header.jsx` | Top bar with admin info + sign-out. |
| `src/components/StatCard.jsx` | Statistic card used on the dashboard. |
| `src/components/ReportsTable.jsx` | Reports table + status pill. |
| `src/components/LocationMap.jsx` | Leaflet + OpenStreetMap view of a report location. |
| `src/layouts/AdminLayout.jsx` | Shared sidebar + header + `<Outlet />`. |
| `src/pages/LoginPage.jsx` | Admin login. |
| `src/pages/AdminDashboard.jsx` | Statistic cards. |
| `src/pages/ReportsPage.jsx` | All reports in a table. |
| `src/pages/ReportDetailsPage.jsx` | Full details + status update. |
| `src/routes/index.jsx` | Route definitions. |

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/login` | Admin login | Public |
| `/admin` | Dashboard | Authority only |
| `/admin/reports` | All reports | Authority only |
| `/admin/reports/:id` | Single report details | Authority only |

## Notes

- If the Firestore `incidents` collection is empty, the app shows **sample
  data** (see `src/services/sampleData.js`) so pages are demonstrable.
- Securing admin access at the database level requires **Firebase Security
  Rules** (see `firestore.rules`) — the React guard alone is not enough for
  real deployment.