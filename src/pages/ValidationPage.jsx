import { useMemo, useState } from 'react';

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

export default function ValidationPage() {
  const [parameters, setParameters] = useState(initialParameters);

  function updateValue(index, field, value) {
    setParameters((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: Number(value) } : row))
    );
  }

  const rows = useMemo(
    () =>
      parameters.map((p) => {
        const status = p.actual >= p.min && p.actual <= p.max ? 'Valid' : 'Out of Range';
        return { ...p, status };
      }),
    [parameters]
  );

  return (
    <section>
      <h2>Validation</h2>
      <div className="actions-row">
        <input placeholder="Machine" defaultValue="INDU-01" />
        <input placeholder="Recipe" defaultValue="Case Hardening V2" />
        <input placeholder="Operator" defaultValue="Operator A" />
        <button>Save</button>
        <button className="secondary">Update</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Min (Editable)</th>
              <th>Max (Editable)</th>
              <th>Actual</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, index) => (
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
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
