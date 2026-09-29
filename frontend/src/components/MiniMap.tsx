import { useMemo } from 'react'

const route = [
  [46, 72], [78, 65], [110, 55], [144, 66], [182, 49], [219, 59], [259, 40], [300, 47], [337, 33], [374, 43], [414, 28], [447, 35],
]

export function MiniMap({ lat, lon }: { lat: number; lon: number }) {
  const p = useMemo(() => {
    const x = 52 + ((lon - 76.93) / 0.14) * 400
    const y = 84 - ((lat - 31.55) / 0.17) * 62
    return { x: Math.max(25, Math.min(470, x)), y: Math.max(22, Math.min(100, y)) }
  }, [lat, lon])
  const points = route.map(([x, y]) => `${x},${y}`).join(' ')
  return <div className="map-box">
    <svg viewBox="0 0 500 130" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0d3550"/><stop offset="1" stopColor="#17374d"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="500" height="130" fill="url(#mapbg)"/>
      <path d="M0 32 C68 14 103 50 168 30 S290 20 356 40 S443 18 500 31" fill="none" stroke="#2b5870" strokeWidth="7" opacity=".35"/>
      <path d="M0 104 C76 79 127 112 205 91 S336 83 500 101" fill="none" stroke="#284f67" strokeWidth="11" opacity=".45"/>
      <path d="M22 126 C77 93 106 110 156 97 S262 101 331 79 S425 77 496 47" fill="none" stroke="#688194" strokeWidth="2" opacity=".7"/>
      <polyline points={points} fill="none" stroke="#26efad" strokeWidth="3" filter="url(#glow)"/>
      <circle cx={route[0][0]} cy={route[0][1]} r="3" fill="#86ffe0"/>
      <circle cx={p.x} cy={p.y} r="7" fill="#35ffbd" filter="url(#glow)"/>
      <circle cx={p.x} cy={p.y} r="16" fill="none" stroke="#35ffbd" strokeOpacity=".28"/>
      <text x="26" y="24" fill="#a4cbe6" fontSize="9">LIVE TRACK</text>
      <text x="25" y="122" fill="#89aec9" fontSize="8">HIMACHAL / SIMULATED RANGE</text>
    </svg>
    <div className="map-tag">Current Position</div>
  </div>
}
