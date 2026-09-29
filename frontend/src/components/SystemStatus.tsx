import { CheckCircle2, Cpu, Radio, Server, Database, PlaneTakeoff } from 'lucide-react'

export function SystemStatus({ systems }: { systems: Record<string, string> }) {
  const iconFor = (k: string) => k.includes('Flight') ? <PlaneTakeoff/> : k.includes('MQTT') ? <Radio/> : k.includes('Database') ? <Database/> : k.includes('Backend') ? <Server/> : <Cpu/>
  return <div className="system-list">{Object.entries(systems).map(([k,v]) => <div key={k}><span>{iconFor(k)}{k}</span><b><CheckCircle2/> {v}</b></div>)}</div>
}
