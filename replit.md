# Mr. OSKAR - Retail Analytics Dashboard

## Project Overview
A comprehensive retail analytics web application with React frontend and Flask backend, featuring real-time customer detection, AI-powered analytics, and live monitoring capabilities.

## Current Status (Nov 27, 2025)
✅ **CONFIGURED FOR REPLIT** - Project successfully imported and configured

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + React Query
- **Backend**: Flask + SQLAlchemy + Flask-Sock (WebSocket)
- **Database**: PostgreSQL (Neon-backed Replit Database)
- **AI/ML**: OpenCV, YOLO v8 detection framework
- **Build Tools**: npm, uv (Python package manager)

## Architecture
```
/home/runner/workspace/
├── client/                      # React frontend (Vite)
│   ├── src/pages/              # Dashboard, Analytics, Alerts, Settings
│   ├── src/components/         # React components
│   └── src/hooks/              # React Query hooks
├── python_backend/             # Flask backend
│   ├── app.py                  # Flask application setup
│   ├── models/                 # SQLAlchemy models
│   ├── routes/                 # API and WebSocket routes
│   ├── camera/                 # Camera management
│   └── ai_detection/           # AI detection framework
├── dist/public/                # Built frontend assets
├── main.py                     # Application entry point
└── pyproject.toml             # Python dependencies
```

## Replit Configuration

### Workflow
- **Name**: Flask Backend
- **Command**: `gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app`
- **Port**: 5000 (serves both API and frontend)
- **Type**: webview

### Deployment
- **Target**: autoscale
- **Build**: `npm run build`
- **Run**: `gunicorn --bind 0.0.0.0:5000 --reuse-port main:app`

## Setup Instructions

### Database Setup (Required)
1. Create a PostgreSQL database in Replit:
   - Go to "Database" tab in Replit
   - Click "Create a database"
   - Select PostgreSQL
   - Replit will automatically set DATABASE_URL environment variable

### Dependencies
- **Python**: Installed via `uv sync` (automatic)
- **Node.js**: Installed via `npm install` (automatic)

### Running Locally
The Flask backend automatically:
1. Initializes the database
2. Creates all tables
3. Loads active cameras from database
4. Serves the built React frontend
5. Provides API endpoints and WebSocket connections

## API Endpoints
- `GET /api/stats/overview` - Overall metrics
- `GET /api/cameras` - List all cameras
- `POST /api/cameras` - Add new camera
- `DELETE /api/cameras/:id` - Remove camera
- `GET /api/analytics/demographics` - Demographics data
- `GET /api/analytics/traffic` - Traffic trends
- `GET /api/alerts` - List alerts
- `PUT /api/alerts/:id` - Update alert status
- `WS /ws/camera/:index` - Real-time camera stream

## Features
- **Dashboard**: Overview metrics (visitors, dwell time, occupancy, zone engagement)
- **Live Surveillance**: Real-time video feed with AI detection
- **Store Heatmap**: Zone-based customer engagement visualization
- **Demographics**: Age distribution and gender ratio analysis
- **Traffic Trends**: Hourly traffic patterns
- **Camera Management**: Multi-camera support with persistence
- **Alerts System**: Maintenance, queue, and flow alerts
- **Settings Panel**: User preferences and system configuration

## Known Limitations
- Camera feeds show empty frames in Replit without physical cameras
- Requires PostgreSQL database to be created via Replit UI
- Seed data uses historical dates (shows zeros until live tracking starts)

## Notes
- Frontend is pre-built and served by Flask
- All API requests use `/api/` prefix
- WebSocket connections for real-time updates
- Database migrations handled by SQLAlchemy
- Static files served from `dist/public/`

## Recent Setup (Nov 27, 2025)
- ✅ Installed Python dependencies with uv
- ✅ Installed Node.js dependencies with npm
- ✅ Built React frontend
- ✅ Configured Flask workflow on port 5000
- ✅ Set up deployment configuration
- ✅ Updated .gitignore for Python and Node.js
