import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function RulChart({ rul, degradation }: { rul: number; degradation: number }) {
  const data = [0, 100, 200, 300, 400].map((h, i) => ({ h, value: Math.max(10, 100 - degradation * .72 - i * (5 + degradation * .02)) }))
  return <div className="rul-box"><div className="rul-value">~ {Math.round(rul)} hrs</div><div className="rul-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{top: 6,right: 8,left:-30,bottom:0}}>
    <CartesianGrid stroke="#1b344a" strokeDasharray="2 4"/>
    <XAxis dataKey="h" fontSize={8} stroke="#6e91a9"/>
    <YAxis fontSize={8} stroke="#6e91a9" domain={[0,100]}/>
    <Tooltip contentStyle={{background:'#061324', border:'1px solid #1886c9', fontSize:10}}/>
    <Line type="monotone" dataKey="value" stroke="#29efae" strokeWidth={2} dot={{r:2}}/>
  </LineChart></ResponsiveContainer></div></div>
}
