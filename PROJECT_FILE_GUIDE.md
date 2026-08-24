# Project File Guide

> **Purpose:** This guide helps team members quickly find the right file to edit for any feature.
> No need to read every file — just jump to the section you need.

---

## 1. Project Overview

**TrafficVision AI** is a smart traffic management web application that monitors live traffic, predicts congestion using an AI model, and manages traffic alerts across three user roles: Admin, Operator, and Commuter.

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React (JavaScript), CSS, React Router DOM       |
| Backend   | Python, FastAPI, SQLAlchemy, SQLite             |
| AI/ML     | Scikit-learn model loaded from a `.pkl` file    |
| Auth      | JWT tokens (stored in browser `localStorage`)   |

**How they connect:**
- The React frontend runs on `http://localhost:3000`.
- The FastAPI backend runs on `http://127.0.0.1:8000`.
- The frontend sends API requests (with a JWT token in the `Authorization` header) to the backend.
- CORS is configured in the backend to allow requests from the frontend.

---

## 2. Project Structure

```
Team_3_Smart_Traffic_AI/
│
├── Backend/                    # Python/FastAPI backend
│   ├── app/                    # Core backend application
│   │   ├── routers/            # API route handlers (one file per feature)
│   │   ├── ml/                 # Trained ML model file
│   │   ├── main.py             # App entry point; registers all routers
│   │   ├── models.py           # Database table definitions
│   │   ├── schemas.py          # Request/response data shapes (Pydantic)
│   │   ├── database.py         # SQLite database connection
│   │   ├── auth_handler.py     # JWT token creation and verification
│   │   ├── dependencies.py     # Shared auth + role-check dependencies
│   │   ├── ml_loader.py        # Loads the ML model on startup
│   │   └── utils.py            # Password hashing helpers
│   ├── seed_users.py           # Script to create demo users in the database
│   ├── users.db                # SQLite database file (auto-created)
│   └── requirements.txt        # Python package dependencies
│
├── frontend/                   # React frontend
│   └── src/
│       ├── App.js              # Routing — maps URLs to page components
│       ├── index.js            # React app entry point
│       ├── pages/              # Full page components (one per screen)
│       ├── components/         # Reusable UI components (sidebar, navbar, etc.)
│       ├── services/           # API call helpers
│       └── styles/             # CSS files (one per page/component)
│
├── README.md                   # Project setup instructions
└── PROJECT_FILE_GUIDE.md       # This file
```

---

## 3. Frontend Files

### `frontend/src/App.js`
**What it does:** Defines all the URL routes in the app. Maps each URL path (e.g. `/admin`, `/alerts`) to the correct page component. Also wraps role-restricted pages in `<ProtectedRoute>` so only the right users can access them.
**Modify this when:** You add a new page, change a URL path, or change which role can access a route.

---

### `frontend/src/index.js`
**What it does:** The starting point of the React app. Renders the root `<App>` component into the HTML page. Wraps everything in `BrowserRouter` to enable React Router.
**Modify this when:** You need to add a global provider (e.g. a theme provider or Redux store).

---

### `frontend/src/pages/Login.jsx`
**What it does:** The login screen. Sends the user's email and password to `POST /auth/login`. On success, saves the JWT token, username, role, and email to `localStorage`, then redirects the user to their role-specific dashboard.
**Modify this when:** You want to change the login form, redirect logic, or what gets saved to `localStorage` after login.

---

### `frontend/src/pages/Register.jsx`
**What it does:** The user registration screen. Sends username, email, password, and role to `POST /auth/register` to create a new account.
**Modify this when:** You want to change the registration form or available roles during sign-up.

---

### `frontend/src/pages/admin/Dashboard.jsx`
**What it does:** The main dashboard for the **Admin** role. Shows an overview of system stats, live traffic data, and quick-access links to other admin features. Uses the Admin layout (sidebar + topbar).
**Modify this when:** You want to change what information the Admin sees on their main dashboard.

---

### `frontend/src/pages/OperatorDashboard.jsx`
**What it does:** The main dashboard for the **Operator** role. Shows camera statuses, live incidents, and tools for managing traffic and updating routes. Has its own sidebar and topbar built in.
**Modify this when:** You want to change what the Operator sees on their dashboard.

---

### `frontend/src/pages/CommuterDashboard.jsx`
**What it does:** The main dashboard for the **Commuter** role. Shows live road conditions, active alerts, and a route recommendation tool. Has its own sidebar and topbar built in.
**Modify this when:** You want to change what the Commuter sees on their dashboard.

---

### `frontend/src/pages/Alerts.jsx`
**What it does:** The Traffic Alerts page, shared across all three roles. Fetches all alerts from the backend and displays them as cards. Role-specific behaviour:
- **Admin & Operator** can Acknowledge, Resolve, Delete, or Update alerts.
- **Commuter** can only view alerts and submit new emergency reports.

**Modify this when:** You want to change the alerts display, add/remove alert actions, or update filtering options.

---

### `frontend/src/pages/LiveMap.jsx`
**What it does:** The Live Traffic Map page. Shows an interactive map with live traffic markers fetched from the backend. Adapts its sidebar/topbar based on the logged-in user's role (Admin, Operator, or Commuter).
**Modify this when:** You want to change the map, markers, or live traffic feed display.

---

### `frontend/src/pages/Prediction.jsx`
**What it does:** The AI Prediction page. Lets the user input traffic conditions (vehicle count, speed, weather, etc.) and calls the backend ML model (`POST /prediction/predict`) to get a predicted congestion level with a confidence score.
**Modify this when:** You want to change the prediction form fields, display format, or the way results are shown.

---

### `frontend/src/pages/Profile.jsx`
**What it does:** The user profile page. Shows the logged-in user's name, role label, and email — read from `localStorage`. Also has an Account Settings section.
**Modify this when:** You want to add or change what is shown on the profile page.

---

### `frontend/src/components/ProtectedRoute.jsx`
**What it does:** A route guard component. Checks if a valid JWT token exists in `localStorage`. If no token is found, it redirects to the login page. If a specific `role` is required and the user's role does not match, it also redirects to login.
**Modify this when:** You need to change the access control logic for protected pages.

---

### `frontend/src/components/admin/Layout.jsx`
**What it does:** A wrapper component for all Admin pages. Renders the Admin `<Sidebar>` on the left and the `<Topbar>` at the top, with the page content in the middle.
**Modify this when:** You want to change the overall layout structure for Admin pages.

---

### `frontend/src/components/admin/Sidebar.jsx`
**What it does:** The collapsible left sidebar for the **Admin** layout. Shows navigation links (Dashboard, Live Traffic, Prediction, Alerts) and the logged-in user's profile card at the bottom.
**Modify this when:** You want to add, remove, or rename navigation items in the Admin sidebar.

---

### `frontend/src/components/admin/Topbar.jsx`
**What it does:** The top navigation bar shown in the **Admin** layout. Displays a "Welcome back, [Name]" greeting, the current date/time, and a notification icon.
**Modify this when:** You want to change the Admin topbar content or greeting text.

---

### `frontend/src/components/OperatorSidebar.jsx`
**What it does:** A simplified sidebar used on pages (like Alerts) when viewed by an Operator. Provides navigation links appropriate for the Operator role.
**Modify this when:** You want to change the navigation links shown to Operators.

---

### `frontend/src/components/UserMenu.jsx`
**What it does:** A dropdown menu component, used mainly in the Commuter and Operator navbars. Shows the logged-in user's name and provides links to Profile and a Logout button.
**Modify this when:** You want to change the user dropdown menu content or the logout behaviour.

---

### `frontend/src/components/TrafficMap.jsx`
**What it does:** The interactive map component (uses Leaflet). Renders road markers on a map with colour-coded congestion levels (Low/Medium/High). Used inside `LiveMap.jsx`.
**Modify this when:** You want to change how the map looks, add new roads, or change marker colours/behaviour.

---

### `frontend/src/components/Background.jsx`
**What it does:** A decorative animated background component used on the Login and Register pages to create a visual effect.
**Modify this when:** You want to change the login/register page background animation or styling.

---

### `frontend/src/components/admin/StatCard.jsx` and `PremiumStatCard.jsx`
**What it does:** Reusable card components that display a single statistic (e.g. "Total Alerts: 12") with an icon and label. Used on the Admin Dashboard.
**Modify this when:** You want to change how stat cards look or what data they display.

---

### `frontend/src/components/admin/GlassCard.jsx`
**What it does:** A styled glass-effect card wrapper used in the Admin Dashboard to group related content in a visually distinct panel.
**Modify this when:** You want to change the glass card visual style.

---

### `frontend/src/components/admin/Sparkline.jsx`
**What it does:** A small inline chart component (sparkline) used inside stat cards on the Admin Dashboard to show a mini trend graph.
**Modify this when:** You want to change how mini trend graphs render on the dashboard.

---

### `frontend/src/services/api.js`
**What it does:** Sets up a shared Axios HTTP client. Automatically attaches the JWT token from `localStorage` to every outgoing API request. Also handles common error responses (401 Unauthorized, 403 Forbidden) centrally.
**Modify this when:** You need to change the backend API base URL, add global request/response logic, or change how token auth is attached.

---

### `frontend/src/styles/global.css`
**What it does:** Global CSS styles that apply across the entire app — base resets, font imports, and CSS variables used as the design system (colors, spacing, etc.).
**Modify this when:** You want to change global fonts, base colors, or shared CSS variables.

---

### `frontend/src/styles/alerts.css`
**What it does:** All styles specific to the Alerts page — the header layout, filter selects, alert cards, summary stat cards, and the emergency button.
**Modify this when:** You want to change how the Alerts page looks.

---

### `frontend/src/styles/admin/` (folder)
**What it does:** Contains CSS files for the Admin layout:
- `layout.css` — Admin page layout (sidebar + content area grid)
- `sidebar.css` — Admin sidebar styles
- `topbar.css` — Admin topbar styles
- `dashboard.css` — Admin dashboard page styles
- `cards.css` — Admin card component styles
- `statcard.css` — Stat card component styles

**Modify this when:** You want to restyle any part of the Admin interface.

---

### Other style files

| File | What it styles |
|------|----------------|
| `styles/login.css` | Login page |
| `styles/register.css` | Register page |
| `styles/operatorDashboard.css` | Operator Dashboard |
| `styles/commuterDashboard.css` | Commuter Dashboard |
| `styles/liveMap.css` | Live Map page |
| `styles/prediction.css` | AI Prediction page |

---

## 4. Backend Files

### `Backend/app/main.py`
**What it does:** The entry point for the FastAPI backend. Creates the app, adds CORS middleware (allows the frontend to communicate with it), creates all database tables on startup, and registers all router modules.
**Modify this when:** You add a new router, change CORS settings, or add new startup logic.

---

### `Backend/app/database.py`
**What it does:** Sets up the SQLite database connection using SQLAlchemy. Defines the database URL (`users.db`), creates the database engine, and provides `SessionLocal` for database session management.
**Modify this when:** You want to switch to a different database (e.g. PostgreSQL) or change the database file location.

---

### `Backend/app/models.py`
**What it does:** Defines the database table structure using SQLAlchemy ORM. Contains four tables:
- `User` — stores user accounts (username, email, hashed password, role)
- `TrafficData` — stores real-time traffic readings per road
- `TrafficPrediction` — stores AI prediction results
- `Alert` — stores traffic alerts with status, severity, and timestamps

**Modify this when:** You need to add a new database table, or add/change columns in an existing table.

---

### `Backend/app/schemas.py`
**What it does:** Defines the shape of data that goes in and out of the API using Pydantic models. Used for request validation and response formatting. Key schemas: `UserCreate`, `UserLogin`, `UserResponse`, `TrafficDataIn`, `TrafficDataOut`, `PredictionIn`, `AlertCreate`, `AlertResponse`.
**Modify this when:** You need to add a new field to an API request or response, or create schemas for a new feature.

---

### `Backend/app/auth_handler.py`
**What it does:** Handles JWT token creation and verification. `create_access_token()` generates a signed JWT with an expiry of 60 minutes. `verify_access_token()` decodes and validates a token.
**Modify this when:** You want to change token expiry duration, the secret key, or the signing algorithm.

> **Important:** Change the `SECRET_KEY` value from `"your-secret-key-change-this"` to a secure random string before deploying to production.

---

### `Backend/app/dependencies.py`
**What it does:** Provides reusable FastAPI dependency functions for endpoints:
- `get_db()` — opens and closes a database session per request
- `get_current_user()` — reads the JWT from the request header and returns the logged-in user
- `admin_required`, `operator_required`, `commuter_required` — role-based access guards

**Modify this when:** You need to change how role-based access works, or add a new role.

---

### `Backend/app/utils.py`
**What it does:** Utility functions for password handling. Contains `hash_password()` (hashes a plain password using bcrypt) and `verify_password()` (checks a plain password against a stored hash).
**Modify this when:** You need to change the password hashing library or add other utility functions.

---

### `Backend/app/ml_loader.py`
**What it does:** Loads the trained ML model from `app/ml/model_bundle.pkl` when the backend starts. The loaded model bundle is stored as a global variable and used by the prediction endpoint.
**Modify this when:** You update the ML model file or change the model loading logic.

---

### `Backend/app/ml/model_bundle.pkl`
**What it does:** The trained machine learning model file. Contains the scikit-learn classification model and the label encoders for categorical inputs (city zone, road type, weather).
**Modify this when:** You retrain the model with new data — replace this file with the newly trained model bundle.

---

### `Backend/app/routers/auth.py`
**What it does:** Handles all authentication-related API routes: register, login, get current user, and role-check test routes for admin/operator/commuter.
**Modify this when:** You want to change login/registration logic, add new auth endpoints, or change what data is returned on login.

---

### `Backend/app/routers/traffic.py`
**What it does:** Handles traffic data ingestion and retrieval. Operators submit new readings (`POST /traffic/ingest`). Any logged-in user can fetch live data (`GET /traffic/live`) or road history (`GET /traffic/history/{road_name}`).
**Modify this when:** You want to change how traffic data is submitted, stored, or queried.

---

### `Backend/app/routers/prediction.py`
**What it does:** Handles the AI congestion prediction endpoint (`POST /prediction/predict`). Accepts traffic input fields, runs them through the loaded ML model, and returns the predicted congestion level and confidence score.
**Modify this when:** You change the ML model's input features or want to change the prediction response format.

---

### `Backend/app/routers/alerts.py`
**What it does:** Handles all alert CRUD operations. Endpoints: create, get all, get active, acknowledge, resolve, delete, and update alerts. Acknowledge/resolve/delete/update are restricted to Admin and Operator roles.
**Modify this when:** You want to add new alert actions, change alert statuses, or modify who can perform which action.

---

### `Backend/app/routers/routes.py`
**What it does:** Handles the route recommendation endpoint (`GET /routes/recommend`). Given an origin and destination, it finds candidate roads, checks their current congestion from the database, calculates estimated travel time, and returns a ranked list.
**Modify this when:** You want to add new origin/destination pairs, change the scoring logic, or add more roads.

---

### `Backend/app/routers/reports.py`
**What it does:** Handles traffic reporting. `GET /reports/traffic-summary` returns an aggregated summary. `GET /reports/export-csv` downloads that data as a CSV file.
**Modify this when:** You want to change what is included in reports or add new report types.

---

### `Backend/seed_users.py`
**What it does:** A standalone script that creates three default demo user accounts in the database (Admin: `vikas@gmail.com`, Operator: `archee@gmail.com`, Commuter: `user@gmail.com`) and adds sample alert records. Run with `python seed_users.py` from the `Backend/` folder.
**Modify this when:** You want to change the default demo users, their passwords, or add more seed data.

---

### `Backend/requirements.txt`
**What it does:** Lists all Python packages the backend needs (FastAPI, SQLAlchemy, python-jose, passlib, etc.). Install all at once with `pip install -r requirements.txt`.
**Modify this when:** You add a new Python library to the backend.

---

## 5. Pages & Components Quick Guide

### Role: Admin
- **Dashboard** → `pages/admin/Dashboard.jsx` — system overview, stats, quick links
- **Sidebar** → `components/admin/Sidebar.jsx` — collapsible navigation
- **Topbar** → `components/admin/Topbar.jsx` — greeting, time, notifications
- **Layout wrapper** → `components/admin/Layout.jsx` — combines sidebar + topbar
- **Alerts page** → `pages/Alerts.jsx` — full CRUD access (acknowledge, resolve, delete, update)

### Role: Operator
- **Dashboard** → `pages/OperatorDashboard.jsx` — camera statuses, incident log, traffic controls
- **Sidebar** → `components/OperatorSidebar.jsx` — navigation for operators
- **Alerts page** → `pages/Alerts.jsx` — can acknowledge, resolve, delete, and update alerts

### Role: Commuter
- **Dashboard** → `pages/CommuterDashboard.jsx` — road conditions, alerts feed, route suggester
- **Alerts page** → `pages/Alerts.jsx` — read-only view + can submit emergency reports
- **User menu** → `components/UserMenu.jsx` — profile dropdown with logout

### Shared Pages (all roles)
- **Live Map** → `pages/LiveMap.jsx` — adapts sidebar/topbar based on user role
- **Prediction** → `pages/Prediction.jsx` — AI congestion prediction tool
- **Profile** → `pages/Profile.jsx` — shows name, role, and email

---

## 6. API Quick Guide

All endpoints require a `Bearer` JWT token in the `Authorization` header, except `/auth/login` and `/auth/register`.

### Authentication
| Endpoint | What it does | Frontend file |
|---|---|---|
| `POST /auth/login` | Log in with email + password. Returns token, role, username. | `pages/Login.jsx` |
| `POST /auth/register` | Create a new user account. | `pages/Register.jsx` |
| `GET /auth/me` | Get the current logged-in user's details. | Internal use |

### Traffic
| Endpoint | What it does | Frontend file |
|---|---|---|
| `POST /traffic/ingest` *(Operator/Admin)* | Submit a new traffic reading for a road. | `pages/OperatorDashboard.jsx` |
| `GET /traffic/live` | Get the latest traffic reading for every road. | `pages/LiveMap.jsx` |
| `GET /traffic/history/{road_name}` | Get up to 50 past readings for a specific road. | `pages/LiveMap.jsx` |

### Prediction
| Endpoint | What it does | Frontend file |
|---|---|---|
| `POST /prediction/predict` | Run the ML model and get a predicted congestion level + confidence. | `pages/Prediction.jsx` |

### Alerts
| Endpoint | What it does | Frontend file |
|---|---|---|
| `POST /alerts/` | Create a new alert (any logged-in user). | `pages/Alerts.jsx` |
| `GET /alerts/` | Get all alerts, newest first. | `pages/Alerts.jsx` |
| `GET /alerts/active` | Get all non-resolved alerts. | `pages/Alerts.jsx` |
| `PATCH /alerts/{id}/acknowledge` *(Admin/Operator)* | Mark alert as Acknowledged. | `pages/Alerts.jsx` |
| `PATCH /alerts/{id}/resolve` *(Admin/Operator)* | Mark alert as Resolved. | `pages/Alerts.jsx` |
| `DELETE /alerts/{id}` *(Admin/Operator)* | Delete an alert permanently. | `pages/Alerts.jsx` |
| `PUT /alerts/{id}` *(Admin/Operator)* | Update alert type, description, location, or severity. | `pages/Alerts.jsx` |

### Routes & Reports
| Endpoint | What it does | Frontend file |
|---|---|---|
| `GET /routes/recommend` | Get ranked route options for an origin/destination. | `pages/CommuterDashboard.jsx` |
| `GET /reports/traffic-summary` | Aggregated traffic stats for the past N days. | `pages/admin/Dashboard.jsx` |
| `GET /reports/export-csv` | Download traffic data as a CSV file. | `pages/admin/Dashboard.jsx` |

---

## 7. "Where Do I Go?" Quick Reference

| What I want to change | File to open |
|---|---|
| **Login page** | `frontend/src/pages/Login.jsx` |
| **Register page** | `frontend/src/pages/Register.jsx` |
| **Admin dashboard** | `frontend/src/pages/admin/Dashboard.jsx` |
| **Operator dashboard** | `frontend/src/pages/OperatorDashboard.jsx` |
| **Commuter dashboard** | `frontend/src/pages/CommuterDashboard.jsx` |
| **Alerts page (UI + logic)** | `frontend/src/pages/Alerts.jsx` |
| **Alerts page (styling)** | `frontend/src/styles/alerts.css` |
| **Alerts API** | `Backend/app/routers/alerts.py` |
| **Live Map page** | `frontend/src/pages/LiveMap.jsx` |
| **Map component** | `frontend/src/components/TrafficMap.jsx` |
| **AI Prediction page** | `frontend/src/pages/Prediction.jsx` |
| **Prediction API** | `Backend/app/routers/prediction.py` |
| **ML model logic** | `Backend/app/routers/prediction.py` + `Backend/app/ml_loader.py` |
| **Admin sidebar** | `frontend/src/components/admin/Sidebar.jsx` |
| **Admin topbar** | `frontend/src/components/admin/Topbar.jsx` |
| **Admin layout (sidebar + topbar wrapper)** | `frontend/src/components/admin/Layout.jsx` |
| **Operator sidebar** | `frontend/src/components/OperatorSidebar.jsx` |
| **User dropdown menu** | `frontend/src/components/UserMenu.jsx` |
| **URL routing (which URL goes to which page)** | `frontend/src/App.js` |
| **Route access control (who can visit which page)** | `frontend/src/components/ProtectedRoute.jsx` |
| **Frontend API calls (base URL, JWT attachment)** | `frontend/src/services/api.js` |
| **Traffic data ingestion / live data API** | `Backend/app/routers/traffic.py` |
| **Route recommendation API** | `Backend/app/routers/routes.py` |
| **Reports / CSV export API** | `Backend/app/routers/reports.py` |
| **Login / register API** | `Backend/app/routers/auth.py` |
| **JWT token logic** | `Backend/app/auth_handler.py` |
| **Role-based access (admin/operator/commuter guards)** | `Backend/app/dependencies.py` |
| **Database tables / columns** | `Backend/app/models.py` |
| **API request/response data shapes** | `Backend/app/schemas.py` |
| **Database connection / settings** | `Backend/app/database.py` |
| **Password hashing** | `Backend/app/utils.py` |
| **Demo users / seed data** | `Backend/seed_users.py` |
| **Python package dependencies** | `Backend/requirements.txt` |
| **Global CSS / design tokens** | `frontend/src/styles/global.css` |
| **Admin page styles** | `frontend/src/styles/admin/` (folder) |
| **Profile page** | `frontend/src/pages/Profile.jsx` |
