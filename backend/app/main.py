from __future__ import annotations

import asyncio
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .engine import DigitalTwinEngine
from .models import MissionRecord, SessionLocal, TelemetryRecord
from .quantum import circuit_preview, hybrid_signal, normalized_features, pennylane_available, qiskit_feature_map_available
from .schemas import ControlRequest, TelemetryOverride

engine = DigitalTwinEngine()
clients: set[WebSocket] = set()


def save_record(state):
    try:
        s = SessionLocal()
        r = TelemetryRecord(
            mission_id=state.mission_id,
            altitude_ft=state.altitude_ft,
            speed_kn=state.speed_kn,
            latitude=state.latitude,
            longitude=state.longitude,
            rpm=state.telemetry["rpm"],
            cht_c=state.telemetry["cht_c"],
            egt_c=state.telemetry["egt_c"],
            oil_pressure_bar=state.telemetry["oil_pressure_bar"],
            oil_temp_c=state.telemetry["oil_temp_c"],
            fuel_flow_lph=state.telemetry["fuel_flow_lph"],
            vibration_mm_s=state.telemetry["vibration_mm_s"],
            battery_v=state.telemetry["battery_v"],
            injection_timing_deg=state.telemetry["injection_timing_deg"],
            health_index=state.health_index,
            anomaly_score=state.anomaly_score,
            fault=state.probable_fault,
            probabilities=state.fault_probabilities,
        )
        s.add(r)
        s.commit()
        s.close()
    except Exception:
        # A database is not required for the visual prototype.
        pass


def ensure_missions():
    try:
        s = SessionLocal()
        existing = {m.mission_id for m in s.query(MissionRecord).all()}
        missions = [
            ("M-2026-0407", "ISR - Coastal Surveillance", "07 Sep 2026, 08:14", "04:32:17", "Completed"),
            ("M-2026-0402", "Endurance Patrol", "02 Sep 2026, 06:45", "07:18:09", "Completed"),
            ("M-2026-0328", "High Altitude Test", "28 Aug 2026, 11:20", "03:10:44", "Completed"),
        ]
        for item in missions:
            if item[0] not in existing:
                s.add(MissionRecord(mission_id=item[0], title=item[1], date=item[2], duration=item[3], status=item[4], payload={"mock": True}))
        s.commit()
        s.close()
    except Exception:
        pass


async def broadcaster_loop():
    while True:
        state = engine.step()
        save_record(state)
        dead = []
        payload = {"type": "telemetry", "state": state.__dict__}
        for ws in list(clients):
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                dead.append(ws)
        for ws in dead:
            clients.discard(ws)
        await asyncio.sleep(1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_missions()
    task = asyncio.create_task(broadcaster_loop())
    yield
    task.cancel()


app = FastAPI(title="Aadi-Shakti Digital Twin API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "aadi-shakti-backend", "mode": engine.mode}


@app.get("/api/state")
async def state():
    s = engine.get_state()
    return s.__dict__ if hasattr(s, "__dict__") else dict(s)


@app.post("/api/control")
async def control(req: ControlRequest):
    engine.set_mode(req.mode)
    return {"mode": engine.mode}


@app.post("/api/telemetry/override")
async def override(req: TelemetryOverride):
    engine.set_overrides(req.model_dump(exclude_none=True))
    return {"mode": engine.mode, "overrides": engine.overrides}


@app.post("/api/telemetry/reset")
async def reset():
    engine.clear_overrides()
    engine.set_mode("auto")
    return {"ok": True, "mode": engine.mode}


@app.get("/api/missions")
async def missions():
    mock = [
        {"mission_id": "M-2026-0407", "title": "ISR - Coastal Surveillance", "date": "07 Sep 2026, 08:14", "duration": "04:32:17", "status": "Completed"},
        {"mission_id": "M-2026-0402", "title": "Endurance Patrol", "date": "02 Sep 2026, 06:45", "duration": "07:18:09", "status": "Completed"},
        {"mission_id": "M-2026-0328", "title": "High Altitude Test", "date": "28 Aug 2026, 11:20", "duration": "03:10:44", "status": "Completed"},
    ]
    return mock


@app.get("/api/quantum/status")
async def quantum_status():
    state = engine.get_state()
    features = normalized_features(state.telemetry, state.residuals)
    return {
        "qiskit_available": qiskit_feature_map_available(),
        "pennylane_available": pennylane_available(),
        "circuit": circuit_preview(features),
        "hybrid_signal": hybrid_signal(features),
        "research_mode": True,
        "note": "Experimental comparison only; no quantum advantage is claimed.",
    }


@app.websocket("/ws/telemetry")
async def telemetry_ws(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        state = engine.get_state()
        await ws.send_text(json.dumps({"type": "telemetry", "state": state.__dict__}))
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        clients.discard(ws)
    except Exception:
        clients.discard(ws)
