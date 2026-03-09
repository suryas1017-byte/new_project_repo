import { useState } from 'react';

const initialParameters = [
  { tag: 'Energy', min: 0.0, max: 0.0, actual: 0.0, unit: 'Kwsec' },
  { tag: 'Heat Time 1', min: 0.0, max: 0.0, actual: 0.0, unit: 'Sec' },
  { tag: 'Soak Time', min: 0.0, max: 0.0, actual: 0.0, unit: 'Sec' },
  { tag: 'Heat Time 2', min: 0.0, max: 0.0, actual: 0.0, unit: 'Sec' },
  { tag: 'Quench Time', min: 0.0, max: 0.0, actual: 0.0, unit: 'Sec' },
  { tag: 'Quench Flow', min: 0, max: 0, actual: 0, unit: 'lpm' },
  { tag: 'Quench Temp', min: 0.0, max: 0.0, actual: 0.0, unit: 'C' },
  { tag: 'Cycle Time', min: 0.0, max: 0.0, actual: 0.0, unit: 'Sec' },
];

const machineRuntimeData = {
  'INDUCTION -01': {
    params: [
      ['Power (kW)', '67.0'],
      ['Energy (kWs)', '1420.5'],
      ['Heat Time 1 (s)', '12.3'],
      ['Soak Time (s)', '8.5'],
      ['Heat Time 2 (s)', '11.8'],
      ['Quench Time (s)', '7.1'],
      ['Quench Flow (lpm)', '162'],
      ['Quench Temperature (C)', '29.4'],
      ['Cycle Time (s)', '45.2'],
    ],
  },
  'INDUCTION-02': {
    params: [
      ['Power (kW)', '0.0'],
      ['Energy (kWs)', '980.2'],
      ['Heat Time 1 (s)', '0.0'],
      ['Soak Time (s)', '0.0'],
      ['Heat Time 2 (s)', '0.0'],
      ['Quench Time (s)', '0.0'],
      ['Quench Flow (lpm)', '120'],
      ['Quench Temperature (C)', '31.1'],
      ['Cycle Time (s)', '0.0'],
    ],
  },
};

export default function ValidationPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDUCTION -01');
  const [parameters, setParameters] = useState(initialParameters);
  const runtime = machineRuntimeData[selectedMachine] ?? { params: [] };

  function updateValue(index, field, value) {
    setParameters((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: Number(value) } : row))
    );
  }

  return (
    <section>
      <h1>Validation</h1>
      <div className="actions-row">
        <label htmlFor="validation-machine">Machine</label>
        <select
          id="validation-machine"
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
        >
          {Object.keys(machineRuntimeData).map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>
        <input placeholder="Recipe" defaultValue="Case Hardening V2" />
        <input placeholder="Operator" defaultValue="Operator A" />
        <button>Save</button>
        <button className="secondary">Update</button>
      </div>

      <div className="validation-two-col">
        <div className="table-card">
          <h3>Validation Parameters</h3>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Min</th>
                <th>Max </th>
                <th>Actual</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((p, index) => (
                <tr key={p.tag}>
                  <td>{p.tag}</td>
                  <td>
                    <input
                      type="number"
                      value={p.min}
                      onChange={(e) => updateValue(index, 'min', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={p.max}
                      onChange={(e) => updateValue(index, 'max', e.target.value)}
                    />
                  </td>
                  <td>{p.actual}</td>
                  <td>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Run Time</h3>
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              {runtime.params.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


