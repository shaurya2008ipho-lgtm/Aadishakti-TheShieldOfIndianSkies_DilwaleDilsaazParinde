import { useEffect, useState } from 'react'
import { Atom, Check, ShieldCheck, Gauge, Zap } from 'lucide-react'
import { getQuantumStatus } from '../lib/api'
import type { TwinState } from '../types/state'

export function QuantumPanel({ state }: { state: TwinState }) {
  const [q, setQ] = useState<{qiskit_available:boolean;pennylane_available:boolean;circuit:{qubits:number;depth:number};note:string} | null>(null)
  useEffect(() => { getQuantumStatus().then(setQ).catch(() => null) }, [state.timestamp])
  return <div className="quantum-panel">
    <div className="quantum-tabs"><span>Classical ML</span><span className="selected">Quantum ML</span><span>Hybrid QML</span></div>
    <div className="q-card-title"><Atom/> Fault Classification <small>(Quantum Kernel + SVM)</small></div>
    <div className="q-models"><div><span>Classical Model</span><strong>{Math.round(state.classical_probability*100)}%</strong><small>{state.probable_fault}</small></div><div className="quantum"><span>Quantum Model</span><strong>{Math.round(state.quantum_probability*100)}%</strong><small>{state.probable_fault}</small></div></div>
    <div className="agreement"><span>Model Agreement <b><Check/> {state.model_agreement ? 'YES' : 'NO'}</b></span><span>Confidence <strong>{state.confidence}</strong></span></div>
    <div className="feature-box"><span>Key Contributing Features</span><ul><li>CHT deviation</li><li>EGT deviation</li><li>Fuel flow deviation</li><li>Vibration pattern</li></ul></div>
    <div className="q-stack"><span>Quantum Technology Stack</span><div><b><ShieldCheck/> Qiskit</b><small>Quantum ML / Kernels</small></div><div><b><Atom/> PennyLane</b><small>Hybrid QML</small></div><div><b><Zap/> D-Wave</b><small>Optimization (P2)</small></div></div>
    <div className="q-footer"><Gauge/> Circuit {q?.circuit?.qubits ?? 4} qubits / depth {q?.circuit?.depth ?? 2}<small>{q?.qiskit_available ? 'Qiskit available' : 'UI-safe fallback'} · {q?.pennylane_available ? 'PennyLane available' : 'PennyLane optional'}</small></div>
  </div>
}
