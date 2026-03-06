import { useMemo, useState } from 'react';

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
};

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export default function DashboardPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDU-01');
  const data = machineData[selectedMachine];

  const defaultFrom = data.series[data.series.length - 5].date;
  const defaultTo = data.series[data.series.length - 1].date;

  const [fromDate, setFromDate] = useState(defaultFrom);
  const [toDate, setToDate] = useState(defaultTo);

  const selectedSeries = useMemo(() => {
    const inRange = data.series.filter((row) => row.date >= fromDate && row.date <= toDate);
    return inRange.length ? inRange : data.series.slice(-5);
  }, [data.series, fromDate, toDate]);

  const productionSeries = useMemo(
    () =>
      selectedSeries.map((row) => ({
        label: row.date.slice(5),
        fullDate: row.date,
        good: Math.round(avg(row.shifts.map((s) => s.good))),
        bad: Math.round(avg(row.shifts.map((s) => s.bad))),
      })),
    [selectedSeries]
  );

  const qtySeries = useMemo(() => selectedSeries, [selectedSeries]);
  const oeeSeries = useMemo(() => selectedSeries, [selectedSeries]);
  const statusSeries = useMemo(() => selectedSeries, [selectedSeries]);

  const totalQty = useMemo(() => qtySeries.reduce((sum, row) => sum + row.qty, 0), [qtySeries]);
  const oeeAvg = useMemo(() => avg(oeeSeries.map((row) => row.oee)).toFixed(1), [oeeSeries]);

  const runningAvg = useMemo(() => avg(statusSeries.map((row) => row.runningHr)).toFixed(1), [statusSeries]);
  const idleAvg = useMemo(() => avg(statusSeries.map((row) => row.idleHr)).toFixed(1), [statusSeries]);
  const stopAvg = useMemo(() => avg(statusSeries.map((row) => row.stopHr)).toFixed(1), [statusSeries]);

  const qtyMax = useMemo(() => Math.max(...qtySeries.map((row) => row.qty)), [qtySeries]);
  const oeeMax = useMemo(() => Math.max(...oeeSeries.map((row) => row.oee)), [oeeSeries]);

  const trendMax = useMemo(() => {
    const maxValue = Math.max(
      ...productionSeries.map((row) => Math.max(row.good, row.bad)),
      60
    );
    return maxValue;
  }, [productionSeries]);

  return (
    <section>
      <h2>Plant Overview</h2>

      <div className="actions-row">
        <label htmlFor="machine-select">Machine</label>
        <select
          id="machine-select"
          value={selectedMachine}
          onChange={(e) => {
            const nextMachine = e.target.value;
            const nextSeries = machineData[nextMachine].series;
            setSelectedMachine(nextMachine);
            setFromDate(nextSeries[nextSeries.length - 5].date);
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
        <article className="card"><h3>Selected Machine</h3><p>{selectedMachine}</p></article>
        <article className="card"><h3>Total Qty (Selected Dates)</h3><p>{totalQty}</p></article>
        <article className="card"><h3>Active Alarms</h3><p>{data.alarms}</p></article>
        <article className="card"><h3>OEE Avg (Selected Dates)</h3><p>{oeeAvg}%</p></article>
      </div>

      <div className="chart-card">
        <h3>PRODUCTION DATE WISE</h3>
        <div className="shift-chart-shell">
          <div className="shift-axis">
            {[60, 45, 30, 15, 0].map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>
          <div className="shift-plot">
            {[60, 45, 30, 15, 0].map((tick) => (
              <div key={tick} className="shift-hline" />
            ))}
            <div
              className="shift-bars-wrap"
              style={{ gridTemplateColumns: `repeat(${productionSeries.length}, 1fr)` }}
            >
              {productionSeries.map((item) => (
                <div key={item.fullDate} className="shift-col">
                  <div className="shift-bar-stack">
                    <span
                      className="shift-bar good"
                      style={{ height: `${(item.good / trendMax) * 220}px` }}
                    />
                    <span
                      className="shift-bar bad"
                      style={{ height: `${(item.bad / trendMax) * 220}px` }}
                    />
                  </div>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>Machine Status Trend (Avg Hours, Selected Dates)</h3>
        <div className="trend-grid">
          <div className="trend-item">
            <span>Running Hr</span>
            <strong>{runningAvg}</strong>
            <div className="trend-bar"><span style={{ width: `${(Number(runningAvg) / 24) * 100}%` }} /></div>
          </div>
          <div className="trend-item">
            <span>Idle Hr</span>
            <strong>{idleAvg}</strong>
            <div className="trend-bar"><span style={{ width: `${(Number(idleAvg) / 24) * 100}%` }} /></div>
          </div>
          <div className="trend-item">
            <span>Stop Hr</span>
            <strong>{stopAvg}</strong>
            <div className="trend-bar"><span style={{ width: `${(Number(stopAvg) / 24) * 100}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>Total Qty Trend (Selected Dates)</h3>
        <table>
          <thead>
            <tr><th>Date</th><th>Total Qty</th><th>Trend</th></tr>
          </thead>
          <tbody>
            {qtySeries.map((row) => (
              <tr key={row.date}>
                <td>{row.date}</td>
                <td>{row.qty}</td>
                <td><div className="trend-bar"><span style={{ width: `${(row.qty / qtyMax) * 100}%` }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-card">
        <h3>OEE Trend (Selected Dates)</h3>
        <table>
          <thead>
            <tr><th>Date</th><th>OEE %</th><th>Trend</th></tr>
          </thead>
          <tbody>
            {oeeSeries.map((row) => (
              <tr key={`oee-${row.date}`}>
                <td>{row.date}</td>
                <td>{row.oee}%</td>
                <td><div className="trend-bar"><span style={{ width: `${(row.oee / oeeMax) * 100}%` }} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}



