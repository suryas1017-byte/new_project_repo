import { useMemo, useState } from 'react';

const dbLogRows = {
  shift: [
    {
      key: 'S-1', timestamp: '2026-03-06 06:35:21', machine: 'INDUCITON -01', batchNo: 'B-240301', programNo: 'PRG-101', shift: 'A',
      energy: 1418.2, soakTime: 8.5, heatTime2: 11.8, quenchTime: 7.1, quenchFlow: 162, quenchTemp: 29.4, heatTime1: 12.3, cycleTime: 45.2,
    },
    {
      key: 'S-2', timestamp: '2026-03-06 08:10:48', machine: 'INDUCITON -01', batchNo: 'B-240302', programNo: 'PRG-101', shift: 'B',
      energy: 1422.0, soakTime: 8.4, heatTime2: 11.9, quenchTime: 7.0, quenchFlow: 160, quenchTemp: 29.1, heatTime1: 12.4, cycleTime: 45.0,
    },
    {
      key: 'S-3', timestamp: '2026-03-06 09:45:03', machine: 'INDUCTION-02', batchNo: 'B-240303', programNo: 'PRG-102', shift: 'C',
      energy: 1398.6, soakTime: 8.7, heatTime2: 12.1, quenchTime: 7.3, quenchFlow: 158, quenchTemp: 30.2, heatTime1: 12.0, cycleTime: 45.6,
    },
  ],
  day: [
    {
      key: 'D-1', timestamp: '2026-03-05 07:00:00', machine: 'INDUCITON -01', batchNo: 'B-240401', programNo: 'PRG-201', shift: 'A',
      energy: 1421.4, soakTime: 8.6, heatTime2: 11.7, quenchTime: 7.2, quenchFlow: 163, quenchTemp: 29.7, heatTime1: 12.2, cycleTime: 45.3,
    },
    {
      key: 'D-2', timestamp: '2026-03-05 13:00:00', machine: 'INDUCITON -01', batchNo: 'B-240402', programNo: 'PRG-201', shift: 'B',
      energy: 1419.1, soakTime: 8.3, heatTime2: 11.8, quenchTime: 7.1, quenchFlow: 161, quenchTemp: 29.5, heatTime1: 12.1, cycleTime: 45.4,
    },
    {
      key: 'D-3', timestamp: '2026-03-05 19:00:00', machine: 'INDUCTION-02', batchNo: 'B-240403', programNo: 'PRG-202', shift: 'C',
      energy: 1402.0, soakTime: 8.8, heatTime2: 12.0, quenchTime: 7.4, quenchFlow: 157, quenchTemp: 30.1, heatTime1: 12.0, cycleTime: 45.7,
    },
  ],
  month: [
    {
      key: 'M-1', timestamp: '2026-03-01 00:00:00', machine: 'INDUCITON -01', batchNo: 'M-2403-W1', programNo: 'PRG-301', shift: 'A',
      energy: 1416.8, soakTime: 8.5, heatTime2: 11.9, quenchTime: 7.2, quenchFlow: 160, quenchTemp: 29.8, heatTime1: 12.2, cycleTime: 45.5,
    },
    {
      key: 'M-2', timestamp: '2026-03-08 00:00:00', machine: 'INDUCITON -01', batchNo: 'M-2403-W2', programNo: 'PRG-301', shift: 'B',
      energy: 1419.4, soakTime: 8.4, heatTime2: 11.8, quenchTime: 7.1, quenchFlow: 161, quenchTemp: 29.6, heatTime1: 12.3, cycleTime: 45.2,
    },
    {
      key: 'M-3', timestamp: '2026-03-15 00:00:00', machine: 'INDUCTION-02', batchNo: 'M-2403-W3', programNo: 'PRG-302', shift: 'C',
      energy: 1421.0, soakTime: 8.7, heatTime2: 12.0, quenchTime: 7.3, quenchFlow: 159, quenchTemp: 30.0, heatTime1: 12.1, cycleTime: 45.4,
    },
  ],
};

export default function ShiftReportPage() {
  const [reportType, setReportType] = useState('shift');
  const [machine, setMachine] = useState('INDUCITON -01');

  const logRows = useMemo(
    () => dbLogRows[reportType].filter((r) => r.machine === machine),
    [reportType, machine]
  );

  const totalQty = useMemo(
    () => logRows.reduce((sum, r) => sum + Number((r.energy / 7).toFixed(0)), 0),
    [logRows]
  );

  return (
    <section className="shift-report-page">
      <h2>Shift Report</h2>
      <div className="actions-row">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="shift">Report Type: Shift Report</option>
          <option value="day">Report Type: Day Report</option>
          <option value="month">Report Type: Month Report</option>
        </select>

        <select value={machine} onChange={(e) => setMachine(e.target.value)}>
          <option value="INDUCITON -01">Machine: INDUCITON -01</option>
          <option value="INDUCTION-02">Machine: INDUCTION-02</option>
        </select>

        <input type="date" defaultValue="2026-03-06" />
        <button>Generate Report</button>
        <button>Export PDF</button>
      </div>

      <div className="kpi-grid">
        <article className="card"><h3>Log Records</h3><p>{logRows.length}</p></article>
        <article className="card"><h3>Total Qty (Derived)</h3><p>{totalQty}</p></article>
      </div>

      <div className="table-card shift-table-card">
        <h3>Database Parameter Log</h3>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Batch No</th>
              <th>Program No</th>
              <th>Shift</th>
              <th>ENERGY</th>
              <th>SOAK TIME</th>
              <th>HEAT TIME2</th>
              <th>QUENCH TIME</th>
              <th>QUENCH FLOW</th>
              <th>QUENCH TEMP</th>
              <th>HEAT TIME 1</th>
              <th>CYCLE TIME</th>
            </tr>
          </thead>
          <tbody>
            {logRows.map((row) => (
              <tr key={row.key}>
                <td>{row.timestamp}</td>
                <td>{row.batchNo}</td>
                <td>{row.programNo}</td>
                <td>{row.shift}</td>
                <td>{row.energy}</td>
                <td>{row.soakTime}</td>
                <td>{row.heatTime2}</td>
                <td>{row.quenchTime}</td>
                <td>{row.quenchFlow}</td>
                <td>{row.quenchTemp}</td>
                <td>{row.heatTime1}</td>
                <td>{row.cycleTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

