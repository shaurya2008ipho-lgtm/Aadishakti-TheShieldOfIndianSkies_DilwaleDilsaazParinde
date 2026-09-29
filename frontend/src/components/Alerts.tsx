import { Bell, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react'

export function Alerts({ alerts }: { alerts: Array<{time:string;level:string;message:string}> }) {
  return <div className="alert-list">
    {alerts.slice(0, 7).map((a, i) => <div className="alert-row" key={`${a.time}-${i}`}>
      <span className={`alert-icon ${a.level.toLowerCase()}`}>{a.level === 'Critical' ? <ShieldAlert/> : a.level === 'Warning' ? <AlertTriangle/> : <CheckCircle2/>}</span>
      <span className="alert-time">{a.time}</span>
      <span className="alert-message">{a.message}</span>
    </div>)}
    {!alerts.length && <div className="empty-state"><Bell/> No alerts</div>}
  </div>
}
