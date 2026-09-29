export type Telemetry = {
  rpm: number
  cht_c: number
  egt_c: number
  oil_pressure_bar: number
  oil_temp_c: number
  fuel_flow_lph: number
  vibration_mm_s: number
  battery_v: number
  injection_timing_deg: number
}

export type TwinState = {
  timestamp: string
  mode: 'auto' | 'manual'
  mission_id: string
  mission: string
  uav_id: string
  latitude: number
  longitude: number
  altitude_ft: number
  speed_kn: number
  heading_deg: number
  fuel_percent: number
  mission_seconds: number
  mission_phase: string
  weather: string
  telemetry: Telemetry
  health_index: number
  anomaly_score: number
  fault_probabilities: Record<string, number>
  probable_fault: string
  probable_fault_probability: number
  classical_probability: number
  quantum_probability: number
  model_agreement: boolean
  confidence: string
  rul_hours: number
  degradation_percent: number
  maintenance_advisory: string
  residuals: Record<string, number>
  systems: Record<string, string>
  alerts: Array<{ time: string; level: string; message: string }>
}
