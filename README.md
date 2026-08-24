# 🚦 TrafficVision AI

> **AI-powered traffic intelligence for safer roads, smarter routing, and real-time traffic operations.**

TrafficVision AI is a smart traffic management platform designed to bring **traffic prediction, live traffic monitoring, route intelligence, incident reporting, and role-based traffic operations** into a single system.

The platform connects an AI/ML backend with a React-based frontend to provide different experiences for **Administrators, Traffic Operators, and Commuters**.

---

## ✨ Key Features

### 🤖 AI Traffic Prediction

Predict traffic conditions using a trained machine-learning model and relevant traffic parameters.

* ML model bundled with the backend
* Prediction API
* Structured prediction inputs
* Frontend prediction interface

### 🗺️ Live Traffic Monitoring

Monitor traffic conditions through an interactive map interface.

* Live traffic visualization
* Traffic status monitoring
* Location-based traffic information
* Google Maps integration

### 🚨 Alert & Incident Management

Allow authorized users to raise and manage traffic alerts.

* Create traffic alerts
* View active alerts
* Track reported incidents
* Role-based alert access

### 🛣️ Smart Route Management

Provide route-related traffic intelligence to support better travel decisions.

* Route information
* Traffic-aware navigation
* Traffic condition analysis

### 👥 Role-Based Access

TrafficVision AI supports multiple user roles with dedicated dashboards and permissions:

| Role                 | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| **Admin**            | System administration, user management, monitoring and overall control |
| **Traffic Operator** | Monitor traffic, manage alerts and operational traffic information     |
| **Commuter**         | View traffic conditions, predictions, routes and relevant alerts       |

### 🔐 Authentication

The platform includes authentication and authorization functionality for secure access.

* User registration
* Login
* Role-based access control
* Protected backend routes
* User profiles

---

## 🏗️ Technology Stack

### Backend

* **Python**
* **FastAPI**
* **SQLite**
* **SQLAlchemy**
* **Scikit-learn**
* **Pickle / PKL model bundle**

### Frontend

* **React.js**
* **JavaScript**
* **CSS**
* **Google Maps**
* **REST APIs**

### Machine Learning

* Python-based ML pipeline
* Pre-trained traffic prediction model
* Serialized model bundle
* Backend inference through prediction APIs

---

## 🔄 System Workflow

```text
                    ┌─────────────────────┐
                    │      User Login     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Role Validation   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐    ┌──────────────┐   ┌───────────┐
        │  Admin   │    │    Traffic   │   │ Commuter  │
        │Dashboard │    │   Operator   │   │Dashboard  │
        └────┬─────┘    └──────┬───────┘   └─────┬─────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ Traffic API │   │ Alerts API  │   │ Prediction  │
      │             │   │             │   │     API     │
      └─────────────┘   └─────────────┘   └──────┬──────┘
                                                 │
                                                 ▼
                                      ┌────────────────────┐
                                      │ ML Model Bundle    │
                                      │ model_bundle.pkl   │
                                      └────────────────────┘
```

---

## 📁 Project Structure

The following files and directories are being added or replaced:

```text
TrafficVision_AI/
│
├── Backend/
│   ├── app/
│   │   ├── ml/
│   │   │   └── model_bundle.pkl
│   │   │
│   │   ├── routers/
│   │   │   ├── alerts.py
│   │   │   ├── auth.py
│   │   │   ├── prediction.py
│   │   │   ├── reports.py
│   │   │   ├── routes.py
│   │   │   └── traffic.py
│   │   │
│   │   ├── auth_handler.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── ml_loader.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── utils.py
│   │
│   ├── requirements.txt
│   ├── seed_users.py
│   └── users.db
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── CommuterDashboard.jsx
│   │   │   ├── LiveMap.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OperatorDashboard.jsx
│   │   │   ├── Prediction.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── README.md
├── System Architecture.pdf
├── TrafficVision_AI_Milestone1_Report.pdf
└── UI Wireframe - made using Figma.pdf
```

---

## ⚙️ Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Create and activate a virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

If the database needs to be initialized with default users:

```bash
python seed_users.py
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation can be accessed through:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will normally run at:

```text
http://localhost:3000
```

---

## 🔗 Frontend ↔ Backend Integration

The frontend communicates with the FastAPI backend through REST APIs.

The central API service is located at:

```text
frontend/src/services/api.js
```

Backend API functionality is organized into dedicated routers:

```text
Backend/app/routers/
├── alerts.py
├── auth.py
├── prediction.py
├── reports.py
├── routes.py
└── traffic.py
```

This separation keeps authentication, prediction, alerts, traffic monitoring, reports, and route operations modular and easier to maintain.

---

## 🧠 Machine Learning Component

The trained traffic prediction model is stored as:

```text
Backend/app/ml/model_bundle.pkl
```

The backend loads the model through:

```text
Backend/app/ml_loader.py
```

Prediction requests are handled through:

```text
Backend/app/routers/prediction.py
```

The general inference flow is:

```text
User Input
    ↓
React Prediction Page
    ↓
Prediction API
    ↓
ML Model Loader
    ↓
model_bundle.pkl
    ↓
Traffic Prediction
    ↓
API Response
    ↓
Prediction Result
```

---

## 🔐 Authentication & Authorization

TrafficVision AI implements authentication at the backend level.

Relevant files include:

```text
Backend/app/
├── auth_handler.py
├── dependencies.py
├── models.py
├── schemas.py
└── routers/auth.py
```

The application uses role-based access to ensure that users see the appropriate functionality for their role.

---

## 🗺️ Live Map

The `LiveMap.jsx` page provides the frontend interface for live traffic visualization.

```text
frontend/src/pages/LiveMap.jsx
```

The map is intended to provide a common traffic-monitoring experience across the supported roles while maintaining role-specific navigation and access.

---

## 🚨 Alert Management

Traffic alerts are handled by:

```text
Backend/app/routers/alerts.py
```

and presented through:

```text
frontend/src/pages/Alerts.jsx
```

The alert workflow connects user-reported incidents with the traffic operations system, allowing relevant traffic information to be surfaced to authorized users.

---

## 📊 Reports

Reporting functionality is exposed through:

```text
Backend/app/routers/reports.py
```

This provides the backend foundation for traffic-related reporting and operational insights.

---

## 🛣️ Route Services

Route-related backend functionality is implemented in:

```text
Backend/app/routers/routes.py
```

This works alongside the live traffic and prediction components to support traffic-aware route intelligence.

---

## 🗄️ Database

TrafficVision AI currently uses SQLite for application data.

```text
Backend/users.db
```

Database configuration and connection handling are implemented in:

```text
Backend/app/database.py
```

Application data models are defined in:

```text
Backend/app/models.py
```

---

## 📱 Main Frontend Pages

The React application contains dedicated pages for the core TrafficVision AI workflows:

```text
Login.jsx
Register.jsx
AdminDashboard.jsx
OperatorDashboard.jsx
CommuterDashboard.jsx
LiveMap.jsx
Prediction.jsx
Alerts.jsx
Profile.jsx
```

The application also contains an `admin/` directory for administrator-specific functionality.

---

## 📚 Project Documentation

The repository includes supporting project documentation:

| File                                     | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| `System Architecture.pdf`                | System architecture and component design |
| `TrafficVision_AI_Milestone1_Report.pdf` | Milestone 1 project documentation        |
| `UI Wireframe - made using Figma.pdf`    | UI/UX wireframes and design reference    |

---

## 🔒 Repository Hygiene

The project includes a root-level `.gitignore` to prevent unnecessary or sensitive development files from being committed.

Before pushing changes, verify that files such as the following are intentionally tracked:

```text
.env
venv/
node_modules/
__pycache__/
*.pyc
```

Do not commit API keys, credentials, or other secrets to the repository.

---

## 🚀 Project Vision

TrafficVision AI aims to move beyond conventional traffic monitoring by combining:

**Real-time Traffic + Machine Learning + Route Intelligence + Incident Reporting + Role-Based Operations**

into one integrated traffic-management platform.

```text
                 TRAFFICVISION AI
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   LIVE TRAFFIC    AI PREDICTION   ALERTS
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                SMART ROUTING
                       │
                       ▼
             BETTER TRAFFIC DECISIONS
                       │
                       ▼
                 SAFER ROADS 🚦
```

---

## 👥 Project Team

**TrafficVision AI** is developed as a collaborative AI/ML and software engineering project, combining machine learning, backend services, frontend development, database management, and traffic intelligence.

---

## 📌 Status

**Current Stage:** Active Development

The project is being continuously improved with enhancements to:

* AI traffic prediction
* Live traffic visualization
* Role-based dashboards
* Alert management
* Route intelligence
* Backend APIs
* Frontend integration
* System reliability and usability

---

> **TrafficVision AI — Turning traffic data into intelligent decisions. 🚦🤖**
