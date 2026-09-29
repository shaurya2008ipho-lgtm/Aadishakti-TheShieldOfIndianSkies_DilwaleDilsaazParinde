from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Literal


class Telemetry(BaseModel):
    rpm: float = Field(4600, ge=0, le=7000)
    cht_c: float = Field(685, ge=0, le=1200)
    egt_c: float = Field(842, ge=0, le=1300)
    oil_pressure_bar: float = Field(4.2, ge=0, le=12)
    oil_temp_c: float = Field(118, ge=0, le=250)
    fuel_flow_lph: float = Field(32, ge=0, le=150)
    vibration_mm_s: float = Field(2.1, ge=0, le=20)
    battery_v: float = Field(27.4, ge=0, le=40)
    injection_timing_deg: float = Field(12.5, ge=-20, le=50)


class ControlRequest(BaseModel):
    mode: Literal["auto", "manual"]


class TelemetryOverride(BaseModel):
    rpm: float | None = None
    cht_c: float | None = None
    egt_c: float | None = None
    oil_pressure_bar: float | None = None
    oil_temp_c: float | None = None
    fuel_flow_lph: float | None = None
    vibration_mm_s: float | None = None
    battery_v: float | None = None
    injection_timing_deg: float | None = None
