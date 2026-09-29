import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { TwinState } from '../types/state'

export function TelemetryChart({ history }: { history: TwinState[] }) {
  const data = history.slice(-50).map((h, i) => ({
    t: i,
    RPM: h.telemetry.rpm / 6,
    CHT: h.telemetry.cht_c,
    EGT: h.telemetry.egt_c,
    Oil: h.telemetry.oil_temp_c,
    Vib: h.telemetry.vibration_mm_s * 120,
  }))
  return <div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top: 10, right: 12, left: -14, bottom: 2}}>
    <CartesianGrid stroke="#1c3950" strokeDasharray="3 5" />
    <XAxis dataKey="t" hide />
    <YAxis hide domain={[0, 1000]} />
    <Tooltip contentStyle={{background:'#051324', border:'1px solid #0f77bc', fontSize:11}}/>
    <Line type="monotone" dataKey="RPM" dot={false} stroke="#20c8ff" strokeWidth={1.8}/>
    <Line type="monotone" dataKey="CHT" dot={false} stroke="#ff9a32" strokeWidth={1.5}/>
    <Line type="monotone" dataKey="EGT" dot={false} stroke="#ff3e47" strokeWidth={1.5}/>
    <Line type="monotone" dataKey="Oil" dot={false} stroke="#36f58e" strokeWidth={1.4}/>
    <Line type="monotone" dataKey="Vib" dot={false} stroke="#c06cff" strokeWidth={1.4}/>
  </LineChart></ResponsiveContainer></div>
}
