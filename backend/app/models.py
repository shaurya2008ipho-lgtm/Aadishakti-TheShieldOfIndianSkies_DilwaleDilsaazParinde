from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import JSON, DateTime, Float, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./aadishakti.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class TelemetryRecord(Base):
    __tablename__ = "telemetry_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    mission_id: Mapped[str] = mapped_column(String(64), index=True)
    altitude_ft: Mapped[float] = mapped_column(Float)
    speed_kn: Mapped[float] = mapped_column(Float)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    rpm: Mapped[float] = mapped_column(Float)
    cht_c: Mapped[float] = mapped_column(Float)
    egt_c: Mapped[float] = mapped_column(Float)
    oil_pressure_bar: Mapped[float] = mapped_column(Float)
    oil_temp_c: Mapped[float] = mapped_column(Float)
    fuel_flow_lph: Mapped[float] = mapped_column(Float)
    vibration_mm_s: Mapped[float] = mapped_column(Float)
    battery_v: Mapped[float] = mapped_column(Float)
    injection_timing_deg: Mapped[float] = mapped_column(Float)
    health_index: Mapped[float] = mapped_column(Float)
    anomaly_score: Mapped[float] = mapped_column(Float)
    fault: Mapped[str] = mapped_column(String(128))
    probabilities: Mapped[dict] = mapped_column(JSON)


class MissionRecord(Base):
    __tablename__ = "missions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    mission_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(128))
    date: Mapped[str] = mapped_column(String(32))
    duration: Mapped[str] = mapped_column(String(32))
    status: Mapped[str] = mapped_column(String(32))
    payload: Mapped[Optional[dict]] = mapped_column(JSON)


Base.metadata.create_all(engine)
