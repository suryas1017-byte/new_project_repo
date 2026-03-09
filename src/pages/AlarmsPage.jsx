import { useState } from 'react';
import { useAlarms } from '../context/AlarmContext';

export default function AlarmsPage() {
  const { activeAlarms, historyAlarms, toggleCritical } = useAlarms();
  const [viewMode, setViewMode] = useState('active');

  const rows = viewMode === 'active' ? activeAlarms : historyAlarms;

  return (
    <section>
      <h2>Alarm</h2>

      <div className="actions-row">
        <button
          type="button"
          className={viewMode === 'active' ? '' : 'secondary'}
          onClick={() => setViewMode('active')}
        >
          Alarm Config
        </button>
        <button
          type="button"
          className={viewMode === 'history' ? '' : 'secondary'}
          onClick={() => setViewMode('history')}
        >
          History
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Critical</th>
              <th>ID</th>
              <th>Alarm</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={a.critical}
                    onChange={() => toggleCritical(a.id)}
                    aria-label={`Mark ${a.id} as critical`}
                    disabled={viewMode === 'history'}
                  />
                </td>
                <td>{a.id}</td>
                <td>{a.alarm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

