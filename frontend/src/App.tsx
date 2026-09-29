import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Box,
  CircleGauge,
  FileText,
  Home,
  Menu,
  PlaySquare,
  Settings,
  Wrench,
  Cpu,
  Radio,
  ShieldCheck,
} from 'lucide-react'

import { Gauge } from './components/Gauge'
import { Panel } from './components/Panel'
import { EngineTwin } from './components/EngineTwin'
import { MiniMap } from './components/MiniMap'
import { HealthPanel } from './components/HealthPanel'
import { TelemetryChart } from './components/TelemetryChart'
import { RulChart } from './components/RulChart'
import { Alerts } from './components/Alerts'
import { SystemStatus } from './components/SystemStatus'
import { QuantumPanel } from './components/QuantumPanel'
import { ControlPanel } from './components/ControlPanel'
import { MockMissionReplay } from './components/MockMissionReplay'
import { EngineAnalysis } from './components/EngineAnalysis'

import {
  DigitalTwinToolbar,
  type TwinMode,
  type TwinTab,
} from './components/DigitalTwinToolbar'

import { WS_URL } from './lib/api'
import type { TwinState } from './types/state'
import './styles.css'

const nav = [
  ['GCS Dashboard', Home],
  ['Live Monitoring', Activity],
  ['Digital Twin', Box],
  ['Engine Analysis', Cpu],
  ['Mission Replay', PlaySquare],
  ['Maintenance', Wrench],
  ['Reports', FileText],
  ['Settings', Settings],
] as const

function fmtTime(s: number) {
  const h = Math.floor(s / 3600)
    .toString()
    .padStart(2, '0')

  const m = Math.floor((s % 3600) / 60)
    .toString()
    .padStart(2, '0')

  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, '0')

  return `${h}:${m}:${sec}`
}

const fallback: TwinState = {
  timestamp: new Date().toISOString(),
  mode: 'auto',

  mission_id: 'M-2026-0407',
  mission: 'ISR - Coastal Surveillance',
  uav_id: 'A-SH23',

  latitude: 31.5762,
  longitude: 76.9482,

  altitude_ft: 28500,
  speed_kn: 220,
  heading_deg: 270,
  fuel_percent: 68,

  mission_seconds: 25937,
  mission_phase: 'CRUISE',
  weather: 'Clear',

  telemetry: {
    rpm: 4600,
    cht_c: 685,
    egt_c: 842,
    oil_pressure_bar: 4.2,
    oil_temp_c: 118,
    fuel_flow_lph: 32,
    vibration_mm_s: 2.1,
    battery_v: 27.4,
    injection_timing_deg: 12.5,
  },

  health_index: 92,
  anomaly_score: 0.08,

  fault_probabilities: {
    Combustion: 0.12,
    Lubrication: 0.08,
    Cooling: 0.11,
    'Fuel System': 0.09,
    Electrical: 0.06,
    Mechanical: 0.07,
  },

  probable_fault: 'Injector Degradation',
  probable_fault_probability: 0.12,

  classical_probability: 0.84,
  quantum_probability: 0.87,

  model_agreement: true,
  confidence: 'High',

  rul_hours: 240,
  degradation_percent: 12,

  maintenance_advisory: 'Inspect injector (next 300 hrs)',

  residuals: {
    'CHT residual': 35,
    'EGT residual': 42,
    'Oil residual': -0.3,
    'Fuel residual': 2,
    'Vibration residual': 0.3,
  },

  systems: {
    FlightGear: 'Simulated',
    'MATLAB/Simulink': 'Running',
    'ANSYS Fluent': 'Running',
    'MQTT Broker': 'Running',
    Database: 'Connected',
    'Backend API': 'Running',
    'Frontend (GCS)': 'Running',
  },

  alerts: [
    {
      time: '10:45',
      level: 'Info',
      message: 'Engine parameters normal',
    },
    {
      time: '10:32',
      level: 'Info',
      message: 'Data received from mock telemetry',
    },
    {
      time: '10:18',
      level: 'Warning',
      message: 'Slight increase in deviation (within range)',
    },
  ],
}

export default function App() {
  const [state, setState] = useState<TwinState>(fallback)
  const [history, setHistory] = useState<TwinState[]>([fallback])

  const [active, setActive] = useState('GCS Dashboard')

  // Digital Twin controls
  const [twinTab, setTwinTab] = useState<TwinTab>('3d')
  const [twinMode, setTwinMode] = useState<TwinMode>('realtime')

  const [missionElapsed, setMissionElapsed] = useState(0)

  const [sidebar, setSidebar] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let ws: WebSocket | undefined
    let timer: number | undefined

    const connect = () => {
      try {
        ws = new WebSocket(WS_URL)

        ws.onopen = () => {
          setConnected(true)
          ws?.send('hello')
        }

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data)

            if (msg.type === 'telemetry') {
              setState(msg.state)

              setHistory((h) => [
                ...h.slice(-70),
                msg.state,
              ])
            }
          } catch {
            // Ignore malformed websocket messages
          }
        }

        ws.onclose = () => {
          setConnected(false)

          timer = window.setTimeout(connect, 1500)
        }

        ws.onerror = () => {
          ws?.close()
        }
      } catch {
        timer = window.setTimeout(connect, 1500)
      }
    }

    connect()

    return () => {
      if (timer) {
        clearTimeout(timer)
      }

      ws?.close()
    }
  }, [])

  useEffect(() => {
    if (active !== 'GCS Dashboard') {
      return
    }

    setMissionElapsed(0)
    const startTime = Date.now()

    const interval = window.setInterval(() => {
      const elapsed = Math.floor(Date.now() - startTime) / 1000
      setMissionElapsed(elapsed)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [active]) 

  const t = state.telemetry

  const healthStatus =
    state.health_index >= 85
      ? 'Normal'
      : state.health_index >= 65
        ? 'Attention'
        : 'Critical'

  const currentSection = useMemo(() => active, [active])

  return (
    <div className="app-shell">

      {/* ============================================================
          TOP BAR
      ============================================================ */}

      <header className="topbar">

        <div className="brand-left">

          <div className="flag">
            <span />
            <span />
            <span />
            <i>◉</i>
          </div>

          <div className="brand">
            <b>AADI-SHAKTI</b>
            <small>THE SHIELD OF INDIAN SKIES</small>
          </div>

        </div>

        <div className="mission-desc">
          AI-Enabled Real-Time Digital Twin System for Health Monitoring,
          Fault Prediction and
          <br />
          Mission Reliability Enhancement of Aero Piston Engines used in
          MALE UAVs.
        </div>

        <div className="inst">

          <div className="crest">
            ✺
          </div>

          <div>
            <b>NIT HAMIRPUR</b>

            <small>
              Technology &nbsp;|&nbsp; Innovation &nbsp;|&nbsp; Nation First
            </small>
          </div>

        </div>

        <div className="flag right">
          <span />
          <span />
          <span />
          <i>◉</i>
        </div>

      </header>

      {/* ============================================================
          MISSION STRIP
      ============================================================ */}

      <div className="mission-strip">

        <span>
          <CircleGauge />
          MISSION :
          <b>{state.mission}</b>
        </span>

        <span>
          UAV ID :
          <b>{state.uav_id}</b>
        </span>

        <span>
          ALTITUDE :
          <b>{state.altitude_ft.toLocaleString()} ft</b>
        </span>

        <span>
          SPEED :
          <b>{state.speed_kn.toFixed(0)} kn</b>
        </span>

        <span>
          FUEL :
          <b>{state.fuel_percent.toFixed(0)}%</b>
        </span>

        <span>
          MISSION TIME :
          <b>{fmtTime(missionElapsed)}</b>
        </span>

        <span className={connected ? 'online' : 'offline'}>
          <Radio />
          {connected ? 'ONLINE' : 'CONNECTING'}
        </span>

      </div>

      {/* ============================================================
          SIDEBAR
      ============================================================ */}

      <aside
        className={`sidebar ${sidebar ? '' : 'collapsed'}`}
      >

        <button
          className="menu-btn"
          onClick={() => setSidebar((v) => !v)}
        >
          <Menu />
        </button>

        {nav.map(([label, Icon]) => (
          <button
            key={label}
            className={`nav-btn ${
              active === label ? 'active' : ''
            }`}
            onClick={() => setActive(label)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}

      </aside>

      {/* ============================================================
          MAIN
      ============================================================ */}

      <main className={`main ${sidebar ? '' : 'wide'}`}>

        {currentSection !== 'GCS Dashboard' && (
          <div className="section-heading">

            <div>
              <span className="eyebrow">
                AADI-SHAKTI / GCS
              </span>

              <h2>
                {currentSection}
              </h2>
            </div>

            <span className="section-state">
              <ShieldCheck />
              Digital Twin synchronized
            </span>

          </div>
        )}

        {/* ==========================================================
            GCS DASHBOARD / LIVE MONITORING
        ========================================================== */}

        {(active === 'GCS Dashboard' ||
          active === 'Live Monitoring') && (
          <>
            {/* ======================================================
                TOP GRID
            ====================================================== */}

            <div className="top-grid">

              {/* ====================================================
                  DIGITAL TWIN PANEL
              ==================================================== */}

              <Panel
                title="DIGITAL TWIN – ENGINE"
                className="twin-panel"
              >

                {/* NEW DIGITAL TWIN TOOLBAR */}

                <DigitalTwinToolbar
                  activeTab={twinTab}
                  setActiveTab={setTwinTab}
                  mode={twinMode}
                  setMode={setTwinMode}
                />

                {/* ================================================
                    3D VIEW
                ================================================= */}

                {twinTab === '3d' && (
                  <EngineTwin egt={t.egt_c} />
                )}

                {/* ================================================
                    THERMAL ANALYSIS
                ================================================= */}

                {twinTab === 'thermal' && (
                  <EngineTwin
                    egt={t.egt_c}
                    mode="thermal"
                  />
                )}

                {/* ================================================
                    ANSYS
                ================================================= */}

                {twinTab === 'ansys' && (
                  <div className="analysis-placeholder">

                    <div className="heat-grid">

                      {Array.from({ length: 36 }).map(
                        (_, i) => (
                          <i
                            key={i}
                            style={{
                              opacity:
                                0.45 +
                                ((i * 13) % 40) / 100,
                            }}
                          />
                        ),
                      )}

                    </div>

                    <b>
                      ANSYS Thermal / CFD Reference View
                    </b>

                    <span>
                      Mock heat field linked to current
                      CHT + EGT deviation
                    </span>

                  </div>
                )}

                {/* ================================================
                    MATLAB / SIMULINK
                ================================================= */}

                {twinTab === 'simulink' && (
                  <div className="analysis-placeholder">

                    <div className="block-diagram">

                      <span>Throttle</span>

                      <i>→</i>

                      <span>Engine Dynamics</span>

                      <i>→</i>

                      <span>Expected Output</span>

                      <i>→</i>

                      <span>Residual</span>

                    </div>

                    <b>
                      MATLAB / Simulink Dynamic Model
                    </b>

                    <span>
                      Physics-inspired expected behaviour
                      for the demo
                    </span>

                  </div>
                )}

                {/* ================================================
                    DIGITAL TWIN STATUS
                ================================================= */}

                <div className="twin-status">

                  <button>
                    Engine Digital Twin
                  </button>

                  <span>
                    ✓ SYNCHRONIZED
                  </span>

                </div>

              </Panel>

              {/* ====================================================
                  ENGINE PARAMETERS
              ==================================================== */}

              <Panel
                title="ENGINE PARAMETERS"
                className="params-panel"
              >

                <div className="gauges">

                  <Gauge
                    label="RPM"
                    value={t.rpm}
                    max={5200}
                    minText="Limit: 4600"
                    valueFormatter={(v) =>
                      Math.round(v).toString()
                    }
                  />

                  <Gauge
                    label="CHT (°C)"
                    value={t.cht_c}
                    max={900}
                    minText="Limit: 750"
                  />

                  <Gauge
                    label="EGT (°C)"
                    value={t.egt_c}
                    max={1000}
                    minText="Limit: 900"
                  />

                  <Gauge
                    label="Oil Pressure (bar)"
                    value={t.oil_pressure_bar}
                    max={6}
                    minText="Min: 3.0"
                  />

                  <Gauge
                    label="Oil Temp (°C)"
                    value={t.oil_temp_c}
                    max={150}
                    minText="Limit: 130"
                  />

                  <Gauge
                    label="Fuel Flow (L/h)"
                    value={t.fuel_flow_lph}
                    max={60}
                    minText="Target: 30"
                  />

                  <Gauge
                    label="Vibration (mm/s)"
                    value={t.vibration_mm_s}
                    max={6}
                    minText="Limit: 5.0"
                  />

                  <Gauge
                    label="Battery (V)"
                    value={t.battery_v}
                    max={30}
                    minText="Nominal: 28"
                  />

                  <Gauge
                    label="Inj. Timing (°)"
                    value={t.injection_timing_deg}
                    max={18}
                    minText="Target: 12"
                  />

                </div>

              </Panel>

              {/* ====================================================
                  AI / ML / QUANTUM
              ==================================================== */}

              <Panel
                title="AI / ML & QUANTUM INTELLIGENCE"
                className="ai-panel"
              >
                <QuantumPanel state={state} />
              </Panel>

            </div>

            {/* ======================================================
                MIDDLE GRID
            ====================================================== */}

            <div className="mid-grid">

              {/* ====================================================
                  MISSION & FLIGHT DATA
              ==================================================== */}

              <Panel
                title="MISSION & FLIGHT DATA"
                className="flight-panel"
              >

                <div className="flight-grid">

                  <div className="flight-facts">

                    <div>
                      Latitude
                      <b>
                        {state.latitude.toFixed(4)}° N
                      </b>
                    </div>

                    <div>
                      Longitude
                      <b>
                        {state.longitude.toFixed(4)}° E
                      </b>
                    </div>

                    <div>
                      Altitude
                      <b>
                        {state.altitude_ft.toLocaleString()} ft
                      </b>
                    </div>

                    <div>
                      Speed
                      <b>
                        {state.speed_kn.toFixed(0)} kn
                      </b>
                    </div>

                    <div>
                      Heading
                      <b>
                        {state.heading_deg.toFixed(0)}°
                      </b>
                    </div>

                    <div>
                      Weather
                      <b>
                        {state.weather}
                      </b>
                    </div>

                  </div>

                  <MiniMap
                    lat={state.latitude}
                    lon={state.longitude}
                  />

                </div>

              </Panel>

              {/* ====================================================
                  HEALTH
              ==================================================== */}

              <HealthPanel
                health={state.health_index}
                fault={state.probable_fault}
                anomaly={state.anomaly_score}
                maintenance={state.maintenance_advisory}
                rul={state.rul_hours}
              />

              {/* ====================================================
                  ANOMALY STATUS
              ==================================================== */}

              <Panel
                title="ANOMALY STATUS"
                className="status-panel"
              >

                <div className="status-list">

                  {Object.entries(
                    state.fault_probabilities,
                  ).map(([k, v]) => (
                    <div key={k}>

                      <span>{k}</span>

                      <span
                        className={
                          v > 0.55
                            ? 'critical'
                            : v > 0.25
                              ? 'warning'
                              : 'good'
                        }
                      >
                        {v > 0.55
                          ? 'Critical'
                          : v > 0.25
                            ? 'Watch'
                            : 'Normal'}
                      </span>

                    </div>
                  ))}

                </div>

                <div className="fault-callout">

                  <AlertCircleIcon />

                  <div>

                    <b>Probable Fault</b>

                    <strong>
                      {state.probable_fault}
                    </strong>

                    <small>
                      {Math.round(
                        state.probable_fault_probability * 100,
                      )}
                      % probability
                    </small>

                  </div>

                </div>

              </Panel>

              {/* ====================================================
                  PROBABLE FAULT
              ==================================================== */}

              <Panel
                title="PROBABLE FAULT"
                className="probable-panel"
              >

                <div className="fault-banner">

                  <AlertCircleIcon />

                  <div>

                    <b>
                      {state.probable_fault}
                    </b>

                    <small>
                      (current classification)
                    </small>

                  </div>

                </div>

                <div className="bar">

                  <i
                    style={{
                      width: `${Math.round(
                        state.probable_fault_probability * 100,
                      )}%`,
                    }}
                  />

                </div>

                <span className="trend-label">

                  Trend

                  <b>
                    {state.health_index > 80
                      ? 'Stable'
                      : 'Degrading'}
                  </b>

                </span>

                <div className="tiny-spark">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>

              </Panel>

              {/* ====================================================
                  DEGRADATION & RUL
              ==================================================== */}

              <Panel
                title="DEGRADATION & RUL"
                className="rul-panel"
              >
                <RulChart
                  rul={state.rul_hours}
                  degradation={state.degradation_percent}
                />
              </Panel>

              {/* ====================================================
                  MAINTENANCE
              ==================================================== */}

              <Panel
                title="MAINTENANCE ADVISORY"
                className="maintenance-panel"
              >

                <div className="maint-content">

                  <Wrench />

                  <b>
                    {state.maintenance_advisory}
                  </b>

                  <small>
                    Check fuel-system calibration
                  </small>

                  <button className="primary">
                    View Report
                  </button>

                </div>

              </Panel>

            </div>

            {/* ======================================================
                BOTTOM GRID
            ====================================================== */}

            <div className="bottom-grid">

              {/* ====================================================
                  SENSOR CHART
              ==================================================== */}

              <Panel
                title="REAL-TIME SENSOR DATA"
                className="chart-panel"
              >

                <div className="legend-row">

                  <span className="c1">
                    ● RPM
                  </span>

                  <span className="c2">
                    ● CHT
                  </span>

                  <span className="c3">
                    ● EGT
                  </span>

                  <span className="c4">
                    ● Oil Temp
                  </span>

                  <span className="c5">
                    ● Vibration
                  </span>

                </div>

                <TelemetryChart history={history} />

              </Panel>

              {/* ====================================================
                  MISSION REPLAY
              ==================================================== */}

              <Panel
                title="MISSION REPLAY"
                className="replay-panel"
              >
                <MockMissionReplay />
              </Panel>

              {/* ====================================================
                  SYSTEM STATUS
              ==================================================== */}

              <Panel
                title="SYSTEM STATUS"
                className="system-panel"
              >
                <SystemStatus systems={state.systems} />
              </Panel>

              {/* ====================================================
                  ALERT LOGS
              ==================================================== */}

              <Panel
                title="ALERT LOGS"
                className="alerts-panel"
                action={
                  <div className="alert-filters">
                    <button>All</button>
                    <button>Info</button>
                    <button>Warning</button>
                    <button>Critical</button>
                  </div>
                }
              >
                <Alerts alerts={state.alerts} />
              </Panel>

            </div>
          </>
        )}

        {/* ==========================================================
            DIGITAL TWIN PAGE
        ========================================================== */}

        {active === 'Digital Twin' && (
          <div className="digital-page">

            <Panel title="INTERACTIVE 3D DIGITAL TWIN">
              <EngineTwin egt={t.egt_c} />
            </Panel>

            <Panel title="LIVE DIGITAL TWIN STATE">
              <ControlPanel
                telemetry={t}
                mode={state.mode}
              />
            </Panel>

            <EngineAnalysis state={state} />

          </div>
        )}

        {/* ==========================================================
            ENGINE ANALYSIS
        ========================================================== */}

        {active === 'Engine Analysis' && (
          <>
            <EngineAnalysis state={state} />

            <Panel title="SCENARIO CONTROLLER">
              <ControlPanel
                telemetry={t}
                mode={state.mode}
              />
            </Panel>
          </>
        )}

        {/* ==========================================================
            MISSION REPLAY
        ========================================================== */}

        {active === 'Mission Replay' && (
          <div className="replay-page">

            <Panel title="MISSION ARCHIVE">
              <MockMissionReplay />
            </Panel>

            <Panel title="MISSION METADATA">

              <div className="metadata">

                <div>
                  <span>Mission</span>
                  <b>ISR - Coastal Surveillance</b>
                </div>

                <div>
                  <span>GPS source</span>
                  <b>Mock route generator</b>
                </div>

                <div>
                  <span>Telemetry source</span>
                  <b>Mock / manual control</b>
                </div>

                <div>
                  <span>Replay state</span>
                  <b className="green">
                    Completed
                  </b>
                </div>

              </div>

            </Panel>

          </div>
        )}

        {/* ==========================================================
            MAINTENANCE
        ========================================================== */}

        {active === 'Maintenance' && (
          <Panel title="MAINTENANCE ADVISORY">

            <div className="maintenance-page">

              <div className="big-rul">

                <span>
                  Remaining Useful Life
                </span>

                <b>
                  ~ {Math.round(state.rul_hours)} hrs
                </b>

                <small>
                  Degradation index{' '}
                  {state.degradation_percent.toFixed(1)}%
                </small>

              </div>

              <div className="recommendations">

                <h4>
                  Current advisory
                </h4>

                <p>
                  {state.maintenance_advisory}
                </p>

                <h4>
                  Observed signals
                </h4>

                <p>
                  CHT {t.cht_c.toFixed(0)}°C · EGT{' '}
                  {t.egt_c.toFixed(0)}°C · Vibration{' '}
                  {t.vibration_mm_s.toFixed(1)} mm/s
                </p>

              </div>

            </div>

          </Panel>
        )}

        {/* ==========================================================
            REPORTS
        ========================================================== */}

        {active === 'Reports' && (
          <Panel title="DEMO REPORT">

            <div className="report-page">

              <h3>
                Aadi-Shakti Engine Health Report
              </h3>

              <p>
                Mission {state.mission_id} · UAV{' '}
                {state.uav_id}
              </p>

              <div className="report-cards">

                <div>
                  <span>Health Index</span>
                  <b>
                    {Math.round(state.health_index)}%
                  </b>
                </div>

                <div>
                  <span>Anomaly</span>
                  <b>
                    {Math.round(
                      state.anomaly_score * 100,
                    )}
                    %
                  </b>
                </div>

                <div>
                  <span>Fault</span>
                  <b>
                    {state.probable_fault}
                  </b>
                </div>

                <div>
                  <span>RUL</span>
                  <b>
                    {Math.round(state.rul_hours)} hrs
                  </b>
                </div>

              </div>

              <div className="report-note">
                This is a simulated hackathon prototype
                report; live FlightGear/ECU/CAN integration
                is not yet connected.
              </div>

            </div>

          </Panel>
        )}

        {/* ==========================================================
            SETTINGS
        ========================================================== */}

        {active === 'Settings' && (
          <Panel title="PROTOTYPE SETTINGS">

            <div className="settings-grid">

              <label>
                <span>
                  Telemetry mode
                </span>

                <b>
                  {state.mode.toUpperCase()}
                </b>
              </label>

              <label>
                <span>
                  Backend
                </span>

                <b>
                  FastAPI + WebSocket
                </b>
              </label>

              <label>
                <span>
                  Frontend
                </span>

                <b>
                  React + TypeScript + Three.js
                </b>
              </label>

              <label>
                <span>
                  Quantum
                </span>

                <b>
                  Qiskit / PennyLane optional
                </b>
              </label>

            </div>

          </Panel>
        )}

      </main>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <footer>
        Smarter Engines <b>|</b> Safer Missions <b>|</b> Stronger Tomorrow
      </footer>

    </div>
  )
}

function AlertCircleIcon() {
  return (
    <span className="alert-circle">
      !
    </span>
  )
}