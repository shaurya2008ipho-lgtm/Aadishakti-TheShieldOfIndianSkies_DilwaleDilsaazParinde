import type { Dispatch, SetStateAction } from 'react'

export type TwinTab = '3d' | 'thermal' | 'ansys' | 'simulink'
export type TwinMode = 'realtime' | 'simulation'

interface DigitalTwinToolbarProps {
  activeTab: TwinTab
  setActiveTab: Dispatch<SetStateAction<TwinTab>>
  mode: TwinMode
  setMode: Dispatch<SetStateAction<TwinMode>>
}

const tabs: Array<{ id: TwinTab; label: string }> = [
  { id: '3d', label: '3D VIEW' },
  { id: 'thermal', label: 'THERMAL ANALYSIS' },
  { id: 'ansys', label: 'ANSYS' },
  { id: 'simulink', label: 'MATLAB / SIMULINK' },
]

export function DigitalTwinToolbar({
  activeTab,
  setActiveTab,
  mode,
  setMode,
}: DigitalTwinToolbarProps) {
  return (
    <div className="twin-toolbar">
      <div className="twin-tabs" role="tablist" aria-label="Digital Twin views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`twin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="twin-mode">
        <span className="twin-mode-label">VIEW MODE</span>

        <div className="twin-mode-switch">
          <button
            type="button"
            className={mode === 'realtime' ? 'active' : ''}
            onClick={() => setMode('realtime')}
          >
            <span className="mode-dot" />
            Real-time
          </button>

          <button
            type="button"
            className={mode === 'simulation' ? 'active' : ''}
            onClick={() => setMode('simulation')}
          >
            Simulation
          </button>
        </div>
      </div>
    </div>
  )
}