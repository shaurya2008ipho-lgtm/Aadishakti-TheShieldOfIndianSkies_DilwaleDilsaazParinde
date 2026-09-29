# AADI-SHAKTI — The Shield of Indian Skies
The GCS Dashboard is deployed at : 
https://aadishakti-the-shield-of-indian-ski.vercel.app/

---

## 1. Overview

AADI-SHAKTI is a proposed **Digital Twin and predictive engine-health platform** for aero-piston engines used in Medium Altitude Long Endurance (MALE) UAV missions.

The central idea is to maintain a continuously updated virtual representation of the engine and use that representation to move from simple threshold monitoring toward **condition awareness, anomaly detection, fault classification, degradation tracking, Remaining Useful Life (RUL) estimation, and maintenance advisory**.

The operator-facing interface is a **Ground Control Station (GCS) dashboard** designed to present the engine, mission state, telemetry, health information, alerts, analytics, replay and maintenance information in one unified operational view.

The project architecture keeps the **classical real-time Digital Twin and predictive-maintenance path as the primary backbone**, while providing an experimental **quantum intelligence layer** for research into quantum-assisted fault discrimination and hybrid quantum-classical learning.

---

## 2. Problem Statement

Aero-piston engines operating in MALE UAV missions are exposed to changing operating conditions such as altitude, endurance, throttle/load variation, temperature and other mission-dependent stresses. Monitoring individual sensor thresholds alone does not provide a complete picture of evolving engine health.

AADI-SHAKTI addresses this challenge by combining:

- Mission and flight context
- Engine telemetry
- Physics-informed expected behaviour
- Digital Twin state estimation
- AI/ML-based anomaly and fault analysis
- Degradation and RUL estimation
- Maintenance advisory
- Historical mission intelligence
- An operator-focused GCS visualization layer

The intended runtime story is:

```text
Mission Conditions
        ↓
Engine Physics / Expected Behaviour
        ↓
Telemetry
        ↓
Digital Twin
        ↓
Physics Residuals + Feature Engineering
        ↓
Classical AI/ML  ↔  Experimental Quantum ML
        ↓
Fault / Health / Degradation / RUL
        ↓
Maintenance Advisory
        ↓
GCS Dashboard + Mission Replay
```

---

## 3. What the GCS Dashboard Demonstrates

The current repository focuses on the **operator-facing AADI-SHAKTI GCS dashboard**.

The dashboard is designed around the following major views and components:

### Mission Strip

Displays the current simulated mission context, including:

- Mission name
- UAV ID
- Altitude
- Speed
- Fuel level
- Mission elapsed time
- Connection/system state

### Digital Twin — Engine

Provides the central engine visualization area with dedicated controls for:

- 3D View
- Thermal Analysis
- ANSYS reference view
- MATLAB/Simulink reference view
- Real-time / Simulation view mode

The 3D layer is implemented using **Three.js / React Three Fiber**, with a GLB/glTF-oriented asset pipeline.

### Engine Parameters

The dashboard is designed to monitor the core engine parameters defined for AADI-SHAKTI, including:

- RPM
- Cylinder Head Temperature (CHT)
- Exhaust Gas Temperature (EGT)
- Oil pressure
- Oil temperature
- Fuel flow
- Vibration
- Battery voltage
- Injection timing

### Engine Health Index

Provides a single high-level health indicator derived from the simulated/diagnostic state.

### Anomaly and Fault Status

Presents:

- Anomaly status
- Probable fault
- Fault probability
- Model confidence / agreement information
- Contributing engine signals

### Degradation and RUL

Visualizes the estimated degradation trajectory and Remaining Useful Life (RUL) concept used by the predictive-maintenance layer.

### Maintenance Advisory

Provides an operator-facing maintenance action based on the current simulated diagnostic state.

### Mission & Flight Data

Displays simulated mission/flight information and the current mock UAV position.

### Real-Time Sensor Data

Plots simulated telemetry history for trend analysis.

### Mission Replay

Provides a UI for replaying a pre-created/mock mission rather than relying on a live FlightGear connection.

### System Status and Alert Logs

Presents subsystem state and an operator-friendly alert history.

---

## 4. Current Prototype Data Strategy

For this hackathon prototype, the team has deliberately used **simulated/mock inputs** for components that were not fully connected to the main dashboard within the available development time.

### Telemetry

The current dashboard can be driven using mock telemetry values instead of claiming live FlightGear or physical ECU/CAN data.

### Mission and Flight Data

Mission metadata and flight values shown in the dashboard are simulated/demo values.

### GPS

The displayed UAV tracking path uses **mock GPS coordinates** for demonstration purposes.

### Mission Replay

Mission replay is based on simulated/prepared mission data.

This is intentional prototype behavior and should not be interpreted as live aircraft telemetry.

---

## 5. Important Development Status / Limitations

### FlightGear integration

Due to the limited hackathon development time, **FlightGear simulation data was not connected to the main GCS dashboard through a live Python integration**.

FlightGear remains part of the intended architecture and future integration path. The current dashboard therefore uses simulated mission/telemetry inputs.

### CAN communication integration

A separate **CAN communication bench/simulator** was prepared to demonstrate the telemetry transport, DBC message structure and Python-side CAN tooling.

However, due to the limited time available, **the CAN simulator was not fully connected into the main AADI-SHAKTI GCS dashboard runtime**.

The CAN layer therefore represents a prepared integration path rather than a claim of end-to-end physical CAN hardware deployment in this repository.

### Quantum intelligence integration

The project architecture includes an experimental **quantum intelligence layer**, particularly around quantum-assisted fault classification and hybrid quantum-classical workflows.

Due to the time available for the hackathon prototype, **the quantum programming/experiments were not fully integrated into the live main dashboard decision loop**.

The intended research path is to compare a strong classical baseline with quantum-kernel / hybrid QML experiments on the same compact feature space. No quantum advantage is claimed by this prototype.

### Physical hardware / PCB

No physical engine sensor PCB or aircraft hardware interface is claimed as part of this repository. The current prototype is primarily a **software and simulation demonstrator**.

---

## 6. Technology Stack

### GCS / Frontend

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- Plotting / telemetry visualization components
- CSS-based GCS visual system

### Digital Twin / Backend Architecture

- Python
- NumPy
- SciPy
- Pandas
- FastAPI
- Pydantic
- WebSockets
- Uvicorn
- SQLAlchemy

### Classical AI/ML

- scikit-learn
- XGBoost
- PyTorch
- SHAP
- Joblib

### Historical Intelligence

- PostgreSQL
- TimescaleDB

### Telemetry / Integration Path

- CAN
- SocketCAN
- python-can
- MQTT / Mosquitto
- DBC-based message definitions

### Engineering / Simulation Integration Path

- FlightGear
- MATLAB / Simulink
- ANSYS Fluent
- ANSYS Mechanical
- SolidWorks
- Blender

### Quantum Intelligence

- Qiskit
- Qiskit Machine Learning
- Qiskit Aer
- PennyLane
- PyTorch-based hybrid quantum-classical workflows
- D-Wave Ocean / dimod for future optimization research

---

## 7. Digital Twin Architecture

The conceptual architecture is divided into functional layers:

```text
┌──────────────────────────────────────────────────────────────┐
│                    MISSION / ENGINEERING                    │
│ FlightGear | MATLAB/Simulink | ANSYS | SolidWorks | Blender │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     TELEMETRY / DATA                        │
│ Sensors / ECU → CAN / SocketCAN / python-can → MQTT        │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    DIGITAL TWIN CORE                        │
│ Python + NumPy + SciPy + Pandas + FastAPI + WebSockets      │
│ Expected State ↔ Observed State → Physics Residuals         │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE LAYER                       │
│                                                              │
│ Classical ML                Experimental Quantum ML          │
│ scikit-learn / XGBoost      Qiskit / PennyLane               │
│ PyTorch / SHAP              Quantum Kernel / Hybrid QML      │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                  UNIFIED DIAGNOSTIC OUTPUT                  │
│ Fault | Health | Degradation | RUL | Maintenance Advisory   │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                         GCS                                 │
│ React + TypeScript + Three.js/R3F + Charts + Mission Replay │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Quantum Intelligence Positioning

Quantum computing is intentionally positioned as a **research/experimental intelligence branch**, not as a replacement for the real-time Digital Twin backbone.

The planned workflow is:

```text
Engine Telemetry
      ↓
Physics Residuals
      ↓
Compact Feature Vector
      ↓
Quantum Feature Map
      ↓
Quantum Kernel / Hybrid QNN
      ↓
Fault Classification
      ↓
Comparison with Classical Baseline
```

The project is intended to investigate whether quantum-assisted representations can contribute to fault discrimination on an appropriately sized feature set.

The project does **not** claim quantum advantage without a benchmark demonstrating it.

---

## 9. Why the Digital Twin Matters

The value of AADI-SHAKTI is not simply displaying sensor values.

The intended Digital Twin concept connects:

**Observed behaviour**

with

**Expected healthy behaviour**

and studies the resulting **deviation/residual** as a diagnostic signal.

That enables a richer reasoning path:

```text
Sensor Values
     +
Mission Context
     +
Expected Engine Behaviour
     ↓
Residual / Deviation
     ↓
Anomaly Detection
     ↓
Fault Classification
     ↓
Health Index
     ↓
Degradation Trend
     ↓
RUL Estimate
     ↓
Maintenance Advisory
```

---

## 10. Future Enhancements

The following are planned or logical next-stage enhancements to take the prototype toward a fuller implementation.

### Live FlightGear Integration

Connect FlightGear mission variables to the Python telemetry pipeline and feed real simulated altitude, speed, throttle and mission phase data into the Digital Twin.

### End-to-End CAN Integration

Connect the CAN simulator / real CAN interface to the same telemetry ingestion API so that decoded frames automatically populate the GCS dashboard and historical data store.

### Physical Sensor Demonstrator

Build a safe laboratory sensor demonstrator with appropriate electronics, signal conditioning and an isolated CAN bench to produce telemetry frames for development and testing.

### Physics-Informed Digital Twin

Connect calibrated MATLAB/Simulink models and selected ANSYS reference results to the Digital Twin so expected engine behaviour can be generated from engineering models rather than fixed demo assumptions.

### Advanced AI / RUL Models

Expand the predictive layer using time-series models and a larger historical engine dataset for more rigorous degradation tracking and RUL estimation.

### Explainable AI

Integrate SHAP-based explanations so the GCS can show why the diagnostic model reached a particular classification.

### Quantum Fault Classification

Train and benchmark a compact quantum-kernel classifier against classical SVM/XGBoost baselines using identical features and evaluation datasets.

### Hybrid Quantum-Classical Learning

Investigate PennyLane + PyTorch workflows in which classical feature extraction and a quantum layer are trained jointly.

### Historical Mission Intelligence

Use PostgreSQL + TimescaleDB for long-term mission and engine-history analysis, fleet-level trends, fault recurrence and maintenance planning.

### Advanced 3D Digital Twin

Improve the engine asset with a detailed engineering model, component-level inspection, animated moving parts, thermal overlays and state-linked visualization.

### Maintenance Optimization

As a later research module, investigate optimization of inspection and maintenance planning under constraints such as RUL, risk, available spares and maintenance windows.

---

## 11. Prototype Demonstration Flow

A suggested demonstration sequence is:

```text
1. Open AADI-SHAKTI GCS
        ↓
2. Show live simulated mission context
        ↓
3. Show interactive 3D engine Digital Twin
        ↓
4. Manipulate / simulate telemetry conditions
        ↓
5. Observe parameter changes
        ↓
6. Show anomaly / probable fault response
        ↓
7. Show health index and degradation
        ↓
8. Show RUL and maintenance advisory
        ↓
9. Show mission replay and mock GPS tracking
        ↓
10. Explain the prepared FlightGear / CAN / Quantum integration paths
```

This sequence demonstrates the core concept while being transparent about which integrations are currently simulated and which remain as future integration work.

---

## 12. Repository Scope

This repository is the **AADI-SHAKTI GCS Dashboard prototype**.

The dashboard repository is intended to provide the operator-facing software demonstrator and the visualization layer.

Separate integration work may include:

- CAN communication bench / simulator
- FlightGear integration
- Quantum experiments
- Engineering-model integration
- Future hardware/sensor demonstrators

Keeping these concerns modular allows each integration to be connected later without redesigning the GCS from scratch.

---

## 13. Local Development

### Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the local Vite development URL shown in the terminal, typically:

```text
http://localhost:5173
```

### Production build test

```bash
npm run build
```

The generated production bundle is placed in:

```text
dist/
```

### Backend

From the backend directory, create and activate a Python virtual environment, install the backend requirements and run the FastAPI service according to the project configuration.

> **Note:** The exact live integration of the backend depends on which optional services are enabled. The current GCS prototype is designed to remain usable with simulated data when FlightGear/CAN/engineering integrations are not connected.

---

## 14. Data and Demonstration Disclaimer

This prototype is a **software/simulation demonstrator developed for hackathon evaluation**.

Current mission telemetry, GPS positions, mission replay data and other dashboard values may be simulated for demonstration purposes.

The absence of a live FlightGear feed, physical CAN telemetry and fully integrated quantum inference in this prototype is an explicit development-status limitation caused by the available hackathon development time, not a claim that those systems are already operational.

The system should not be treated as an operational flight-control, aircraft safety or maintenance certification system.

---

## 15. Research Direction

AADI-SHAKTI is designed as an extensible platform rather than a single static dashboard. The long-term research direction is to combine:

**Mission intelligence + engineering physics + telemetry + Digital Twin state + classical AI + experimental QML + historical maintenance intelligence**

into one integrated engine-health ecosystem.

The intended outcome is a system that can help an operator move from:

> **“What is the engine reading now?”**

toward:

> **“What is happening, why is it happening, how is the engine degrading, what could happen next, and what maintenance action should be considered?”**

---

## 16. Project Tagline

> **AADI-SHAKTI — Monitor. Analyse. Predict. Protect.**

---

## 17. References / Project Basis

The technical architecture and component mapping for this prototype were based on the project's SIH problem statement presentation and the team's updated Aadi-Shakti software ecosystem, including the intended roles of FlightGear, CAN/SocketCAN, Python Digital Twin services, classical ML, Qiskit/PennyLane, PostgreSQL/TimescaleDB, and the React/Three.js GCS layer.

---

**JAI HIND 🇮🇳**
