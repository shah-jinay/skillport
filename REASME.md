# SkillPort

SkillPort is a platform designed to help software engineers **find visa-friendly tech jobs**.  
**Phase 0** provides the **foundation**: a FastAPI backend, a React + Tailwind frontend, and Postgres database, all running locally through Docker.

---

## ✨ Features in Phase 0
- **FastAPI Backend**
  - Health check endpoint: `GET /health`
  - Visit logger endpoint: `POST /events/visit` (anonymous visit tracking)

- **React Frontend**
  - Clean, responsive layout built with Vite + TailwindCSS
  - Displays API health status live
  - Logs each page visit to backend
  - Sample job cards as placeholders for real data

- **Postgres Database**
  - Running in Docker
  - Future-ready for companies, jobs, and visa filing data

- **Single Command Dev Environment**
  - Spin up backend, frontend, and DB together with:
    ```bash
    docker compose up --build
    ```

---

## 🗂 Project Structure
skillport/
│
├── docker-compose.yml # Orchestrates DB, API, and Web
├── README.md # This file
│
├── api/ # FastAPI backend
│ ├── Dockerfile
│ ├── requirements.txt
│ └── app/
│ ├── main.py # Entry point for FastAPI
│ ├── visits.py # Visit logging route
│ └── init.py
│
├── web/ # React frontend
│ ├── Dockerfile
│ ├── index.html
│ ├── vite.config.js
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ ├── package.json
│ └── src/
│ ├── App.jsx # Main UI
│ ├── main.jsx # React entry point
│ ├── index.css # Tailwind styles
│ │
│ ├── lib/
│ │ └── api.js # Functions to call backend
│ │
│ └── components/ # Reusable UI blocks
│ ├── Layout.jsx
│ └── JobCard.jsx
│
└── dbdata/ # Auto-created volume for Postgres data

yaml
Copy code

---

## ⚡ Quick Start

### 1. Prerequisites
Make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v18+ recommended)

---

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/skillport.git
cd skillport
3. Start the App
Build and run all services (API, DB, Frontend) at once:

bash
Copy code
docker compose up --build
Frontend → http://localhost:5173

Backend → http://localhost:8000

4. Verify the API
Check that the backend is alive:

bash
Copy code
curl http://localhost:8000/health
Expected response:

json
Copy code
{"ok": true}
5. Test Visit Logger
Log a visit manually:

bash
Copy code
curl -X POST http://localhost:8000/events/visit \
-H "Content-Type: application/json" \
-d '{"path": "/"}'
Expected response:

json
Copy code
{"ok": true, "count": 1}
Every time you reload the frontend, this count should increase.
You’ll also see logs in the backend terminal.

🌐 Frontend UI
Homepage loads sample job cards.

Visit logs are sent automatically when someone visits the page.

The footer displays the live API health check result.

🔗 API Endpoints
Method	Endpoint	Description
GET	/health	Health check for backend. Returns {"ok": true}
POST	/events/visit	Logs anonymous visit {path, timestamp}

🧰 Commands
Command	Description
docker compose up --build	Build and start all services
docker compose down	Stop containers
docker compose logs -f api	Watch API logs live
docker compose logs -f web	Watch Frontend logs live
curl http://localhost:8000/health	Quick health test

🛣 Roadmap
Phase 1: Core Product
Postgres migrations and models for:

Companies

Jobs

Visa filings

GET /jobs and GET /companies endpoints

Replace sample jobs with live data in frontend

Add search and filters (role, location, visa level)

Phase 2: Advanced Features
Authentication for companies & job seekers

Admin dashboard

Real-time analytics

Global CDN deployment

📝 Example Logs
When you visit the frontend, you should see backend logs like this:

pgsql
Copy code
api-1  | INFO:     192.168.65.1:58124 - "GET /health HTTP/1.1" 200 OK
api-1  | INFO:     192.168.65.1:58125 - "POST /events/visit HTTP/1.1" 200 OK
💡 Developer Tips
Hard-refresh the frontend (Cmd+Shift+R) when making frontend code changes.

Keep browser DevTools → Network tab open to debug API calls.

Watch Docker logs in another terminal:

bash
Copy code
docker compose logs -f
If something breaks, rebuild everything cleanly:

bash
Copy code
docker compose down
docker compose build --no-cache
docker compose up
📜 License
This project is open source and available under the MIT License.

🤝 Contributing
Fork the repo

Create a feature branch

Commit changes

Open a pull request

This README will keep evolving as SkillPort grows beyond Phase 0, but now it documents the foundation for your visa-friendly job platform.

arduino
Copy code

This README clearly explains **how to set up, run, and verify Phase 0**, while also outlining the roadmap for future phases.

