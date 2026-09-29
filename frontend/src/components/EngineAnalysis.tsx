import { Activity, BrainCircuit, Thermometer, Waves } from 'lucide-react'
import type { TwinState } from '../types/state'
import { Panel } from './Panel'

export function EngineAnalysis({ state }: { state: TwinState }) {
  const entries = Object.entries(state.residuals)
  return <div className="analysis-grid">
    <Panel title="PHYSICS RESIDUALS"><div className="residuals">{entries.map(([k,v])=><div key={k}><span>{k}</span><b className={Math.abs(v)>35?'warn':''}>{v>0?'+':''}{v.toFixed(1)}</b><div><i style={{width:`${Math.min(100, Math.abs(v)*1.8+10)}%`}}/></div></div>)}</div></Panel>
    <Panel title="ENGINEERING EVIDENCE"><div className="evidence-grid"><div><Thermometer/><b>Thermal</b><span>Mock Fluent heat field</span></div><div><Activity/><b>Dynamic model</b><span>Simulink reference</span></div><div><Waves/><b>Vibration</b><span>FFT feature path</span></div><div><BrainCircuit/><b>AI/QML</b><span>Hybrid diagnostic</span></div></div></Panel>
  </div>
}
