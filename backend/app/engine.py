from __future__ import annotations

import math
import random
import time
from collections import deque
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any


LIMITS = {
    "rpm": (0, 5200, 4600),
    "cht_c": (0, 750, 650),
    "egt_c": (0, 900, 800),
    "oil_pressure_bar": (3.0, 8.0, 4.5),
    "oil_temp_c": (0, 130, 105),
    "fuel_flow_lph": (15, 60, 30),
    "vibration_mm_s": (0, 5.0, 1.8),
    "battery_v": (24, 30, 28),
    "injection_timing_deg": (8, 16, 12),
}

FAULT_NAMES = ["Combustion", "Lubrication", "Cooling", "Fuel System", "Electrical", "Mechanical"]


@dataclass
class TwinState:
    timestamp: str
    mode: str
    mission_id: str
    mission: str
    uav_id: str
    latitude: float
    longitude: float
    altitude_ft: float
    speed_kn: float
    heading_deg: float
    fuel_percent: float
    mission_seconds: int
    mission_phase: str
    weather: str
    telemetry: dict[str, float]
    health_index: float
    anomaly_score: float
    fault_probabilities: dict[str, float]
    probable_fault: str
    probable_fault_probability: float
    classical_probability: float
    quantum_probability: float
    model_agreement: bool
    confidence: str
    rul_hours: float
    degradation_percent: float
    maintenance_advisory: str
    residuals: dict[str, float]
    systems: dict[str, str]
    alerts: list[dict[str, Any]]


class DigitalTwinEngine:
    def __init__(self):
        self.mode = "auto"
        self.t = 0
        self.overrides: dict[str, float] = {}
        self.history: deque[dict[str, Any]] = deque(maxlen=120)
        self.alerts: deque[dict[str, Any]] = deque(maxlen=25)
        self._last_alert_signature = ""
        self.rng = random.Random(126462)

        self.route = [
            (31.560, 76.940), (31.572, 76.948), (31.586, 76.960),
            (31.600, 76.975), (31.617, 76.988), (31.631, 76.997),
            (31.645, 77.004), (31.658, 77.014), (31.672, 77.022),
            (31.686, 77.034), (31.697, 77.047), (31.706, 77.060),
        ]

    def set_mode(self, mode: str):
        self.mode = mode

    def set_overrides(self, values: dict[str, float | None]):
        for k, v in values.items():
            if v is not None:
                self.overrides[k] = float(v)

    def clear_overrides(self):
        self.overrides = {}

    def _base_telemetry(self) -> dict[str, float]:
        phase = self.t % 180
        throttle = 0.72 + 0.08 * math.sin(self.t / 25)
        rpm = 4500 + 400 * throttle + 120 * math.sin(self.t / 9)
        cht = 615 + 75 * throttle + 10 * math.sin(self.t / 15)
        egt = 760 + 95 * throttle + 16 * math.sin(self.t / 12)
        oil_p = 4.2 + 0.25 * math.sin(self.t / 20)
        oil_t = 104 + 12 * throttle + 2 * math.sin(self.t / 17)
        fuel = 26 + 8 * throttle + 1.6 * math.sin(self.t / 14)
        vibration = 1.65 + 0.35 * abs(math.sin(self.t / 7)) + 0.12 * self.rng.random()
        battery = 27.9 - 0.7 * (self.t % 300) / 300 + 0.06 * math.sin(self.t / 18)
        inj = 12.0 + 0.5 * math.sin(self.t / 21)
        if phase < 30:
            altitude = 18000 + phase * 280
        elif phase < 120:
            altitude = 26400 + 1900 * math.sin((phase - 30) / 90 * math.pi / 2)
        else:
            altitude = 28300 + 200 * math.sin(self.t / 12)
        speed = 195 + 24 * throttle + 5 * math.sin(self.t / 11)
        return {
            "rpm": rpm, "cht_c": cht, "egt_c": egt,
            "oil_pressure_bar": oil_p, "oil_temp_c": oil_t,
            "fuel_flow_lph": fuel, "vibration_mm_s": vibration,
            "battery_v": battery, "injection_timing_deg": inj,
        }

    def _apply_fault_interactions(self, d: dict[str, float]):
        # Manual changes are treated as operator-injected scenarios.
        egt_over = max(0.0, d["egt_c"] - 830) / 120
        cht_over = max(0.0, d["cht_c"] - 660) / 120
        oil_low = max(0.0, 4.0 - d["oil_pressure_bar"]) / 1.5
        oil_hot = max(0.0, d["oil_temp_c"] - 120) / 30
        vib = max(0.0, d["vibration_mm_s"] - 2.5) / 3
        inj = abs(d["injection_timing_deg"] - 12.0) / 6
        battery = max(0.0, 27.0 - d["battery_v"]) / 3
        fuel_dev = abs(d["fuel_flow_lph"] - 30) / 25
        probabilities = {
            "Combustion": 0.08 + 0.35 * egt_over + 0.15 * inj,
            "Lubrication": 0.05 + 0.50 * oil_low + 0.18 * oil_hot,
            "Cooling": 0.06 + 0.50 * cht_over + 0.18 * egt_over,
            "Fuel System": 0.05 + 0.35 * fuel_dev + 0.12 * inj,
            "Electrical": 0.04 + 0.60 * battery,
            "Mechanical": 0.04 + 0.55 * vib,
        }
        probabilities = {k: min(0.99, max(0.01, v)) for k, v in probabilities.items()}
        peak = max(probabilities, key=probabilities.get)
        peak_prob = probabilities[peak]
        anomaly = min(
            1.0,
            0.24 * egt_over + 0.20 * cht_over + 0.20 * oil_low +
            0.11 * oil_hot + 0.14 * vib + 0.05 * battery + 0.06 * inj + 0.04 * fuel_dev,
        )
        health = max(4.0, 100 * (1 - anomaly * 0.90))
        degradation = max(0.0, min(100.0, (100 - health) * 1.55 + egt_over * 5 + vib * 7))
        rul = max(38.0, 420 - degradation * 2.0)
        confidence = "High" if peak_prob > 0.65 else "Medium" if peak_prob > 0.35 else "Low"
        classical = peak_prob * (0.96 + 0.03 * math.sin(self.t / 11))
        quantum = min(0.99, peak_prob * (1.03 + 0.04 * math.cos(self.t / 17)))
        return probabilities, peak, peak_prob, anomaly, health, degradation, rul, confidence, classical, quantum

    def step(self) -> TwinState:
        self.t += 1
        base = self._base_telemetry()
        if self.mode == "manual":
            for k, v in self.overrides.items():
                if k in base:
                    base[k] = v
        else:
            for k, v in self.overrides.items():
                # Auto mode preserves manual safety-test overrides but relaxes them slowly.
                base[k] = 0.7 * v + 0.3 * base.get(k, v)

        route_index = min(len(self.route) - 1, self.t % len(self.route))
        lat, lon = self.route[route_index]
        lat += 0.0025 * math.sin(self.t / 5)
        lon += 0.0025 * math.cos(self.t / 6)

        probs, fault, fault_prob, anomaly, health, degradation, rul, confidence, classical, quantum = self._apply_fault_interactions(base)
        agreement = abs(classical - quantum) < 0.10

        mission_phase = "CRUISE" if self.t % 180 >= 60 else "CLIMB"
        maintenance = "No action required" if health >= 85 else (f"Inspect {fault.lower()} system within {max(2, int(rul/40))} hrs")
        if health < 65:
            maintenance = f"Schedule immediate inspection — {fault.lower()} risk elevated"

        residuals = {
            "CHT residual": base["cht_c"] - 650,
            "EGT residual": base["egt_c"] - 800,
            "Oil residual": base["oil_pressure_bar"] - 4.5,
            "Fuel residual": base["fuel_flow_lph"] - 30,
            "Vibration residual": base["vibration_mm_s"] - 1.8,
        }

        alert_level = "Info"
        alert_message = "Engine parameters normal"
        if anomaly > 0.60:
            alert_level = "Critical"
            alert_message = f"High anomaly score — {fault} probability {fault_prob:.0%}"
        elif anomaly > 0.25:
            alert_level = "Warning"
            alert_message = f"Slight increase in deviation — {fault} trending"

        signature = f"{alert_level}:{fault}"
        if signature != self._last_alert_signature or self.t % 12 == 0:
            self.alerts.appendleft({
                "time": datetime.now().strftime("%H:%M"),
                "level": alert_level,
                "message": alert_message,
            })
            self._last_alert_signature = signature

        for name in FAULT_NAMES:
            probs[name] = round(probs[name], 3)

        state = TwinState(
            timestamp=datetime.now(timezone.utc).isoformat(),
            mode=self.mode,
            mission_id="M-2026-0407",
            mission="ISR - Coastal Surveillance",
            uav_id="A-SH23",
            latitude=round(lat, 6),
            longitude=round(lon, 6),
            altitude_ft=round(28500 + 120 * math.sin(self.t / 18), 0),
            speed_kn=round(220 + 6 * math.sin(self.t / 16), 1),
            heading_deg=round((270 + 4 * math.sin(self.t / 20)) % 360, 1),
            fuel_percent=round(max(12, 68 - self.t * 0.015), 1),
            mission_seconds=4 * 60 + 32 * 60 + self.t,
            mission_phase=mission_phase,
            weather="Clear",
            telemetry={k: round(v, 2) for k, v in base.items()},
            health_index=round(health, 1),
            anomaly_score=round(anomaly, 3),
            fault_probabilities=probs,
            probable_fault=fault,
            probable_fault_probability=round(fault_prob, 3),
            classical_probability=round(classical, 3),
            quantum_probability=round(quantum, 3),
            model_agreement=agreement,
            confidence=confidence,
            rul_hours=round(rul, 1),
            degradation_percent=round(degradation, 1),
            maintenance_advisory=maintenance,
            residuals={k: round(v, 2) for k, v in residuals.items()},
            systems={
                "FlightGear": "Simulated",
                "MATLAB/Simulink": "Running",
                "ANSYS Fluent": "Running",
                "MQTT Broker": "Running",
                "Database": "Connected",
                "Backend API": "Running",
                "Frontend (GCS)": "Running",
            },
            alerts=list(self.alerts),
        )
        record = asdict(state)
        self.history.append(record)
        return state

    def get_state(self) -> TwinState:
        # Don't advance time for GET; return a useful snapshot.
        return self.history[-1] if self.history else self.step()
