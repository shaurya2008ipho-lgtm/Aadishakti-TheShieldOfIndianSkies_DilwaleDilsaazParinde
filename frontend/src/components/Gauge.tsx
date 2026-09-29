export function Gauge({ label, value, unit, minText, max = 100, warnAt = 75, valueFormatter }: { label: string; value: number; unit?: string; minText?: string; max?: number; warnAt?: number; valueFormatter?: (v: number) => string }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))
  const gradient = `conic-gradient(from -120deg, #23f58b 0deg, #23f58b ${percent * 2.4}deg, #142b42 ${percent * 2.4}deg 280deg, transparent 280deg)`
  const compact = valueFormatter ? valueFormatter(value) : Number.isInteger(value) ? value.toString() : value.toFixed(1)
  return <div className="gauge-card">
    <div className="gauge-label">{label}</div>
    <div className="gauge" style={{ background: gradient }}>
      <div className="gauge-inner"><strong>{compact}</strong>{unit && <span>{unit}</span>}</div>
    </div>
    <div className={`gauge-sub ${value / max > warnAt / 100 ? 'warn' : ''}`}>{minText}</div>
  </div>
}
