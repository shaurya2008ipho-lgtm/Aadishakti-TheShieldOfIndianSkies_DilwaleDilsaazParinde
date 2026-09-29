"""Optional quantum adapters.

The demo deliberately works without quantum packages. When Qiskit or PennyLane is
installed, these helpers can create compact feature-map circuits for experiments.
They are not presented as proof of quantum advantage.
"""

from __future__ import annotations

import math


def normalized_features(telemetry: dict[str, float], residuals: dict[str, float]) -> list[float]:
    values = [
        telemetry.get("rpm", 4600) / 5200,
        telemetry.get("cht_c", 650) / 900,
        telemetry.get("egt_c", 800) / 1000,
        telemetry.get("oil_pressure_bar", 4.5) / 6,
        telemetry.get("vibration_mm_s", 1.8) / 6,
        residuals.get("EGT residual", 0) / 150,
        residuals.get("Oil residual", 0) / 2,
        residuals.get("Vibration residual", 0) / 3,
    ]
    return [max(-1.0, min(1.0, x)) for x in values]


def qiskit_feature_map_available() -> bool:
    try:
        from qiskit.circuit.library import ZZFeatureMap  # noqa: F401
        return True
    except Exception:
        return False


def pennylane_available() -> bool:
    try:
        import pennylane as qml  # noqa: F401
        return True
    except Exception:
        return False


def circuit_preview(features: list[float]) -> dict:
    try:
        from qiskit.circuit.library import ZZFeatureMap
        fmap = ZZFeatureMap(feature_dimension=min(4, len(features)), reps=2, entanglement="linear")
        return {"available": True, "framework": "Qiskit", "depth": fmap.decompose().depth(), "qubits": fmap.num_qubits}
    except Exception:
        return {"available": False, "framework": "fallback", "depth": 2, "qubits": min(4, len(features))}


def hybrid_signal(features: list[float]) -> float:
    # Small deterministic experimental score for the demo adapter.
    return round(sum(math.sin((i + 1) * x * math.pi) for i, x in enumerate(features[:4])) / 4, 4)
