# Aadi-Shakti — Shield of Indian Skies

Hackathon prototype for **SIH26054: AI-Enabled Real-Time Digital Twin System for Health Monitoring, Fault Prediction and Mission Reliability Enhancement of Aero-Piston Engines used in MALE UAVs.**

This implementation intentionally uses **mock telemetry, mock mission/flight data, and mock GPS coordinates** because the current prototype does not yet have a FlightGear→Python connection or physical CAN/ECU feed. The mock layer is controllable from the website so that the team can demonstrate normal and fault scenarios live.

## Architecture

```text
Mock Telemetry Controller
        │
        ▼
FastAPI Mock Telemetry Engine ── WebSocket ──► React GCS
        │                                      │
        ├─ Digital Twin state                  ├─ 3D Three.js engine twin
        ├─ Physics-inspired residuals         ├─ gauges + trends
        ├─ Classical diagnostic scoring        ├─ mission/map/replay
        └─ Experimental QML scoring             └─ maintenance/alerts
        │
        ▼
PostgreSQL/TimescaleDB (optional; SQLite is local default)
```

The software ecosystem follows the supplied Aadi-Shakti stack: Python, FastAPI/WebSockets, NumPy/SciPy/Pandas, scikit-learn/XGBoost/PyTorch hooks, PostgreSQL/TimescaleDB, React/TypeScript/Vite, Three.js/React Three Fiber, and Qiskit/PennyLane research hooks. The operational path stays classical; the quantum branch is explicitly experimental.

## 1. Start backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Linux/macOS:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Backend: http://localhost:8000
Swagger: http://localhost:8000/docs

## 2. Start frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

Create `frontend/.env` only when the backend runs somewhere other than localhost:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/telemetry
```

## 3. Optional database

The app defaults to local SQLite, so the demo works without a database server.

For PostgreSQL, set:

```env
DATABASE_URL=postgresql+psycopg://aadi:aadi@localhost:5432/aadishakti
```

A `docker-compose.yml` is included for PostgreSQL + Mosquitto. TimescaleDB can be substituted with your preferred TimescaleDB image in deployment.

## 4. Optional quantum environment

The UI exposes the quantum branch as an experimental comparison. The backend has optional Qiskit/PennyLane adapters but does **not** claim quantum advantage.

```bash
pip install -r requirements-quantum.txt
```

The application still runs when these optional packages are absent.

## Demo flow

1. Open **GCS Dashboard**.
2. Keep the mission in **AUTO** mode and watch simulated telemetry move.
3. Switch to **MANUAL CONTROL** and change EGT, CHT, oil pressure, vibration, or injector timing.
4. Introduce an abnormal combination; the health index, anomaly score, fault probabilities, degradation trend and maintenance advisory respond.
5. Open **Digital Twin** to rotate the 3D engine and view thermal state.
6. Open **Mission Replay** to replay a stored mock mission.
7. Use **Engine Analysis** to view physics residuals and the classical vs quantum-kernel comparison.

## Important prototype disclosure for presentation

> The current prototype emulates live operations with simulated telemetry, mission history and mock GPS coordinates. FlightGear, ECU/CAN and high-fidelity engineering tool integration are planned integration stages.

