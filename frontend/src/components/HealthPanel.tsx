import type { CSSProperties } from 'react'
import { CheckCircle2, AlertTriangle, CircleDot, Wrench } from 'lucide-react'
import { Panel } from './Panel'

export function HealthPanel({ health, fault, anomaly, maintenance, rul }: { health: number; fault: string; anomaly: number; maintenance: string; rul: number }) {
  const healthy = health >= 85
  return <Panel title="ENGINE HEALTH INDEX" className="health-panel">
    <div className="health-content">
      <div className="health-ring" style={{ '--health': `${health * 3.6}deg` } as CSSProperties}><div><strong>{Math.round(health)}%</strong><span>{healthy ? 'HEALTHY' : 'ATTENTION'}</span></div></div>
      <div className="health-copy">
        <div className={healthy ? 'ok-line' : 'warn-line'}>{healthy ? <CheckCircle2/> : <AlertTriangle/>} Overall Status <b>{healthy ? 'Normal' : 'Degraded'}</b></div>
        <p><CheckCircle2/> {anomaly < .25 ? 'No critical faults detected.' : `Anomaly score ${(anomaly*100).toFixed(0)}%.`}</p>
        <p><CircleDot/> Probable fault <b>{fault}</b></p>
        <p><Wrench/> RUL estimate <b>~ {Math.round(rul)} hrs</b></p>
        <div className="maintenance-mini">{maintenance}</div>
      </div>
    </div>
  </Panel>
}
