const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws/telemetry'

export async function setMode(mode: 'auto' | 'manual') {
  const r = await fetch(`${API_URL}/api/control`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) })
  return r.json()
}

export async function overrideTelemetry(payload: Record<string, number>) {
  const r = await fetch(`${API_URL}/api/telemetry/override`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  return r.json()
}

export async function resetTelemetry() {
  const r = await fetch(`${API_URL}/api/telemetry/reset`, { method: 'POST' })
  return r.json()
}

export async function getMissions() {
  const r = await fetch(`${API_URL}/api/missions`)
  return r.json()
}

export async function getQuantumStatus() {
  const r = await fetch(`${API_URL}/api/quantum/status`)
  return r.json()
}
