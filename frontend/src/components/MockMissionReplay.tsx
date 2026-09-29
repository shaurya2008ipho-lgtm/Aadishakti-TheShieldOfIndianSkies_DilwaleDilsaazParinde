import { Play, Pause, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

const pts = [[34,72],[82,61],[126,69],[171,48],[218,58],[259,43],[304,52],[350,35],[394,42],[442,30]]
export function MockMissionReplay() {
  const [playing, setPlaying] = useState(false)
  const [idx, setIdx] = useState(3)
  useEffect(() => { if (!playing) return; const id=setInterval(()=>setIdx(v=> v >= pts.length-1 ? 0 : v+1),600); return ()=>clearInterval(id)},[playing])
  return <div className="replay-card">
    <div className="replay-map"><svg viewBox="0 0 480 120" preserveAspectRatio="none"><rect width="480" height="120" fill="#10344d"/><path d="M0 22 C80 40 110 16 190 35 S320 20 480 36 M0 100 C90 75 160 107 240 83 S370 90 480 74" fill="none" stroke="#2a566e" strokeWidth="18" opacity=".45"/><polyline points={pts.map(p=>p.join(',')).join(' ')} fill="none" stroke="#35edb1" strokeWidth="3"/><circle cx={pts[idx][0]} cy={pts[idx][1]} r="8" fill="#35edb1"/></svg><button className="play-button" onClick={()=>setPlaying(!playing)}>{playing ? <Pause/> : <Play/>}</button></div>
    <div className="replay-info"><div><span>Mission ID</span><b>M-2026-0407</b></div><div><span>Date</span><b>07 Sep 2026, 08:14</b></div><div><span>Duration</span><b>04:32:17</b></div><div><span>Status</span><b className="green">Completed</b></div></div>
    <div className="replay-actions"><button className="primary">Replay Mission</button><button className="icon-btn" onClick={()=>{setIdx(0);setPlaying(false)}} title="Reset"><RotateCcw/></button></div>
  </div>
}
