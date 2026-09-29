# Aadi-Shakti implementation notes

## What is live in this prototype

- Mock telemetry loop runs from the FastAPI backend.
- Manual controls can inject engine conditions from the GCS.
- Digital Twin state, anomaly score, fault probabilities, health index, degradation and RUL recalculate from the same state.
- Mock GPS follows a simulated route and updates the GCS map.
- Mission replay uses a mock mission trajectory.
- Three.js renders a procedural aero-piston engine representation; it can later be replaced by a GLB exported from Blender/SolidWorks.
- ANSYS/Simulink tabs are evidence-view placeholders linked to the mock physics residual layer.
- Optional Qiskit/PennyLane adapters are included and are intentionally non-blocking.

## What is not claimed

- No FlightGear-to-Python live connection is included.
- No physical CAN/ECU stream is included.
- No actual CFD calculation is executed by the web UI.
- No quantum advantage is claimed.

## Where to connect real integrations later

1. Replace `DigitalTwinEngine._base_telemetry()` with decoded FlightGear/SocketCAN/MQTT values.
2. Replace the procedural `EngineTwin` geometry with `public/engine.glb` and update `EngineTwin.tsx` to load it with `useGLTF`.
3. Replace the physics-inspired residual function with MATLAB/Simulink or ANSYS-derived expected outputs.
4. Replace the diagnostic scoring with trained XGBoost/PyTorch/SHAP pipelines.
5. Connect TimescaleDB retention/hypertables for high-rate telemetry.
6. Move quantum adapters into a separate inference service when benchmark datasets are stable.
