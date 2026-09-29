import { useEffect, useState } from 'react'
import type { Telemetry } from '../types/state'
import { overrideTelemetry, resetTelemetry, setMode } from '../lib/api'

const fields: Array<{ key: keyof Telemetry; label: string; min: number; max: number; step: number; unit: string }> = [
  { key: 'rpm', label: 'RPM', min: 3000, max: 5800, step: 10, unit: '' },
  { key: 'cht_c', label: 'CHT', min: 450, max: 900, step: 1, unit: '°C' },
  { key: 'egt_c', label: 'EGT', min: 550, max: 1100, step: 1, unit: '°C' },
  { key: 'oil_pressure_bar', label: 'Oil Pressure', min: 1, max: 7, step: 0.1, unit: 'bar' },
  { key: 'oil_temp_c', label: 'Oil Temp', min: 70, max: 160, step: 1, unit: '°C' },
  { key: 'fuel_flow_lph', label: 'Fuel Flow', min: 15, max: 60, step: 1, unit: 'L/h' },
  { key: 'vibration_mm_s', label: 'Vibration', min: 0.5, max: 8, step: 0.1, unit: 'mm/s' },
  { key: 'battery_v', label: 'Battery', min: 22, max: 30, step: 0.1, unit: 'V' },
  { key: 'injection_timing_deg', label: 'Injection Timing', min: 6, max: 20, step: 0.1, unit: '°' },
]

export function ControlPanel({ telemetry, mode }: { telemetry: Telemetry; mode: 'auto' | 'manual' }) {
  const [values, setValues] = useState(telemetry)
  useEffect(() => { if (mode === 'auto') setValues(telemetry) }, [telemetry, mode])

  const update = (key: keyof Telemetry, value: number) => setValues((v) => ({ ...v, [key]: value }))
  const apply = async () => {
    await setMode('manual')
    await overrideTelemetry(values as unknown as Record<string, number>)
  }
  const auto = async () => { await resetTelemetry(); await setMode('auto') }

  return <div className="control-panel">
    <div className="control-top"><span>Telemetry Source</span><span className={`mode-pill ${mode}`}>{mode === 'manual' ? 'MANUAL' : 'AUTO SIM'}</span></div>
    <p className="muted">Simulated telemetry only — move the sliders to inject demo scenarios.</p>
    <div className="slider-grid">
      {fields.map((f) => <label key={f.key}>
        <span><b>{f.label}</b><em>{values[f.key].toFixed(f.step < 1 ? 1 : 0)} {f.unit}</em></span>
        <input type="range" min={f.min} max={f.max} step={f.step} value={values[f.key]} onChange={(e) => update(f.key, Number(e.target.value))}/>
      </label>)}
    </div>
    <div className="control-actions"><button className="primary" onClick={apply}>Apply manual scenario</button><button className="ghost" onClick={auto}>Return to auto simulation</button></div>
  </div>
}
