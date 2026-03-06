import { useState } from 'react';

const machineRuntimeData = {
  'INDU-01': {
    state: 'Running',
    connection: 'Online',
    lastUpdate: '2 sec ago',
    params: [
      ['Power (kW)', '67.0', 'Normal'],
      ['Energy (kWs)', '1420.5', 'Normal'],
      ['Heat Time 1 (s)', '12.3', 'Normal'],
      ['Soak Time (s)', '8.5', 'Normal'],
      ['Heat Time 2 (s)', '11.8', 'Normal'],
      ['Quench Time (s)', '7.1', 'Normal'],
      ['Quench Flow (lpm)', '162', 'Normal'],
      ['Quench Temperature (C)', '29.4', 'Normal'],
      ['Cycle Time (s)', '45.2', 'High'],
    ],
  },
  'INDU-02': {
    state: 'Idle',
    connection: 'Online',
    lastUpdate: '4 sec ago',
    params: [
      ['Power (kW)', '0.0', 'Normal'],
      ['Energy (kWs)', '980.2', 'Normal'],
      ['Heat Time 1 (s)', '0.0', 'Normal'],
      ['Soak Time (s)', '0.0', 'Normal'],
      ['Heat Time 2 (s)', '0.0', 'Normal'],
      ['Quench Time (s)', '0.0', 'Normal'],
      ['Quench Flow (lpm)', '120', 'Normal'],
      ['Quench Temperature (C)', '31.1', 'Normal'],
      ['Cycle Time (s)', '0.0', 'Normal'],
    ],
  },
};

export default function RunStatusPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDU-01');
  const runtime = machineRuntimeData[selectedMachine];

  return (
    <section>
      <h2>Run Status (Read Only)</h2>

      <div className="actions-row">
        <label htmlFor="run-machine-select">Machine</label>
        <select
          id="run-machine-select"
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
        >
          {Object.keys(machineRuntimeData).map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>
      </div>

      <div className="kpi-grid">
        <article className="card"><h3>Machine State</h3><p>{runtime.state}</p></article>
        <article className="card"><h3>Connection</h3><p>{runtime.connection}</p></article>
        <article className="card"><h3>Last Update</h3><p>{runtime.lastUpdate}</p></article>
        <article className="card"><h3>Access</h3><p>Read Only</p></article>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Actual</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {runtime.params.map((row) => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

