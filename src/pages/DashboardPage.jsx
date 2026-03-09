import { useMemo, useState } from 'react';
import { useAlarms } from '../context/AlarmContext';

function iso(date) {
  return date.toISOString().slice(0, 10);
}

function generateMachineSeries(machineId, days = 30) {
  const end = new Date();
  const seed = machineId.charCodeAt(machineId.length - 1);
  const series = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);

    const drift = (days - i) % 7;
    const qty = 860 + seed * 22 + drift * 18 + ((i * 13 + seed) % 55);
    const oee = 72 + (seed % 7) + ((i + seed) % 9);
    const runningHr = 12 + ((i + seed) % 7) * 0.9;
    const idleHr = 3 + ((i + seed * 2) % 4) * 0.7;
    const stopHr = 24 - runningHr - idleHr;

    const shifts = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'].map((s, idx) => {
      const good = 34 + ((i + seed + idx * 3) % 27);
      const bad = (i + idx + seed) % 6;
      return { shift: s, good, bad };
    });

    series.push({
      date: iso(d),
      qty,
      oee,
      runningHr: Number(runningHr.toFixed(1)),
      idleHr: Number(idleHr.toFixed(1)),
      stopHr: Number(stopHr.toFixed(1)),
      shifts,
    });
  }

  return series;
}

const machineData = {
  'INDU-01': { alarms: 3, series: generateMachineSeries('INDU-01') },
  'INDU-02': { alarms: 5, series: generateMachineSeries('INDU-02') },
  'INDU-03': { alarms: 8, series: generateMachineSeries('INDU-03') },
  'INDU-04': { alarms: 2, series: generateMachineSeries('INDU-04') },
};

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDU-01');
  const [showAlarmNotifications, setShowAlarmNotifications] = useState(false);
  const { activeAlarms, selectedActiveAlarms, clearAlarm } = useAlarms();
  const data = machineData[selectedMachine];

  const defaultFrom = data.series[data.series.length - 10].date;
  const defaultTo = data.series[data.series.length - 1].date;

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);

  const filteredSeries = useMemo(
    () => data.series.filter((row) => row.date >= fromDate && row.date <= toDate),
    [data.series, fromDate, toDate]
  );

  const safeSeries = filteredSeries.length ? filteredSeries : [data.series[data.series.length - 1]];

  const totalQty = useMemo(
    () => safeSeries.reduce((sum, value) => sum + value.qty, 0),
    [safeSeries]
  );

  const runningAvg = useMemo(() => avg(safeSeries.map((row) => row.runningHr)).toFixed(1), [safeSeries]);
  const idleAvg = useMemo(() => avg(safeSeries.map((row) => row.idleHr)).toFixed(1), [safeSeries]);
  const stopAvg = useMemo(() => avg(safeSeries.map((row) => row.stopHr)).toFixed(1), [safeSeries]);

  const productionTrendBars = useMemo(
    () =>
      safeSeries.map((row) => {
        const reject = Math.max(1, Math.round(row.qty * 0.03));
        const good = row.qty - reject;
        return { label: row.date.slice(5), good, reject };
      }),
    [safeSeries]
  );

  const productionScaleMax = useMemo(() => {
    const maxGood = Math.max(...productionTrendBars.map((row) => row.good), 2000);
    return Math.ceil(maxGood / 500) * 500;
  }, [productionTrendBars]);

  const productionTicks = useMemo(
    () => [productionScaleMax, Math.round(productionScaleMax * 0.75), Math.round(productionScaleMax * 0.5), Math.round(productionScaleMax * 0.25), 0],
    [productionScaleMax]
  );

  return (
    <section className="dashboard-page">
      <div className="dashboard-header-row">
        <h2>Plant Overview</h2>
        <button
          type="button"
          className="alarm-icon-btn"
          onClick={() => setShowAlarmNotifications((prev) => !prev)}
          aria-label="Toggle alarm notifications"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 2a6 6 0 0 0-6 6v3.3l-1.5 3.2a1 1 0 0 0 .9 1.5h13.2a1 1 0 0 0 .9-1.5L18 11.3V8a6 6 0 0 0-6-6Zm0 20a3 3 0 0 0 2.8-2h-5.6a3 3 0 0 0 2.8 2Z" />
          </svg>
          {selectedActiveAlarms.length > 0 && (
            <span className="alarm-icon-badge">{selectedActiveAlarms.length}</span>
          )}
        </button>
      </div>

      <div className="actions-row">
        <label htmlFor="machine-select">Machine</label>
        <select
          id="machine-select"
          value={selectedMachine}
          onChange={(e) => {
            const next = e.target.value;
            const nextSeries = machineData[next].series;
            setSelectedMachine(next);
            setFromDate(nextSeries[nextSeries.length - 10].date);
            setToDate(nextSeries[nextSeries.length - 1].date);
          }}
        >
          {Object.keys(machineData).map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>

        <label htmlFor="from-date">From</label>
        <input
          id="from-date"
          type="date"
          value={fromDate}
          min={data.series[0].date}
          max={toDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <label htmlFor="to-date">To</label>
        <input
          id="to-date"
          type="date"
          value={toDate}
          min={fromDate}
          max={data.series[data.series.length - 1].date}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      <div className="kpi-grid">
        <article className="card">
          <h3>Selected Machine</h3>
          <p>{selectedMachine}</p>
        </article>
        <article className="card">
          <h3>Total Qty (Date Range)</h3>
          <p>{totalQty}</p>
        </article>
        <article className="card">
          <h3>Active Alarms</h3>
          <p>{activeAlarms.length}</p>
        </article>
      </div>


      {showAlarmNotifications && (
        <div className="table-card alarm-notification-card">
          <h3>Active Alarm Notifications</h3>
          {selectedActiveAlarms.length === 0 ? (
            <p className="alarm-empty">No selected critical alarms.</p>
          ) : (
            <div className="alarm-notify-list">
              {selectedActiveAlarms.map((alarm) => (
                <div key={alarm.id} className="alarm-notify-item">
                  <div>
                    <strong>{alarm.id}</strong>
                    <p>{alarm.alarm}</p>
                  </div>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => clearAlarm(alarm.id)}
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="table-card">
        <h3>Machine Running Report</h3>
        <div className="trend-grid">
          <div className="trend-item">
            <span>Running Hr</span>
            <strong>{runningAvg}</strong>
            <div className="trend-bar">
              <span style={{ width: `${(Number(runningAvg) / 24) * 100}%` }} />
            </div>
          </div>
          <div className="trend-item">
            <span>Idle Hr</span>
            <strong>{idleAvg}</strong>
            <div className="trend-bar">
              <span style={{ width: `${(Number(idleAvg) / 24) * 100}%` }} />
            </div>
          </div>
          <div className="trend-item">
            <span>Stop Hr</span>
            <strong>{stopAvg}</strong>
            <div className="trend-bar">
              <span style={{ width: `${(Number(stopAvg) / 24) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <h3>PRODUCTION REPORT</h3>
        <div className="shift-chart-shell">
          <div className="shift-axis">
            {productionTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className="shift-plot">
            {productionTicks.map((tick) => (
              <div key={tick} className="shift-hline" />
            ))}
            <div
              className="shift-bars-wrap"
              style={{ gridTemplateColumns: `repeat(${productionTrendBars.length || 1}, 1fr)` }}
            >
              {productionTrendBars.map((item) => (
                <div key={item.label} className="shift-col">
                  <div className="shift-bar-stack">
                    <span
                      className="shift-bar good"
                      style={{ height: `${(item.good / productionScaleMax) * 220}px` }}
                    />
                    <span
                      className="shift-bar bad"
                      style={{ height: `${(item.reject / productionScaleMax) * 220}px` }}
                    />
                  </div>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}








