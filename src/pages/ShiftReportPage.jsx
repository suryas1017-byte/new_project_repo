export default function ShiftReportPage() {
  const batchRows = [
    { shift: 'A', batch: 'B-240301', machine: 'INDU-01', total: 210, ok: 203, notOk: 7 },
    { shift: 'A', batch: 'B-240302', machine: 'INDU-01', total: 195, ok: 188, notOk: 7 },
    { shift: 'B', batch: 'B-240303', machine: 'INDU-02', total: 175, ok: 169, notOk: 6 },
  ];

  return (
    <section>
      <h2>Shift Report</h2>
      <div className="actions-row">
        <select defaultValue="shift">
          <option value="shift">Report Type: Shift Wise</option>
          <option value="batch">Report Type: Batch Wise</option>
          <option value="machine">Report Type: Machine Wise</option>
        </select>
        <select defaultValue="INDU-01">
          <option value="INDU-01">Machine: INDU-01</option>
          <option value="INDU-02">Machine: INDU-02</option>
          <option value="INDU-03">Machine: INDU-03</option>
          <option value="INDU-04">Machine: INDU-04</option>
        </select>
        <select defaultValue="A">
          <option value="A">Shift: A</option>
          <option value="B">Shift: B</option>
          <option value="C">Shift: C</option>
        </select>
        <select defaultValue="B-240301">
          <option value="B-240301">Batch: B-240301</option>
          <option value="B-240302">Batch: B-240302</option>
          <option value="B-240303">Batch: B-240303</option>
        </select>
        <input type="date" defaultValue="2026-03-05" />
        <button>Generate Report</button>
        <button>Export PDF</button>
      </div>

      <div className="kpi-grid">
        <article className="card"><h3>Total Qty</h3><p>580</p></article>
        <article className="card"><h3>OK Qty</h3><p>552</p></article>
        <article className="card"><h3>Not OK Qty</h3><p>28</p></article>
        <article className="card"><h3>Rejection</h3><p>4.82%</p></article>
      </div>

      <div className="table-card">
        <h3>Shift Wise Batch Report</h3>
        <table>
          <thead>
            <tr>
              <th>Shift</th>
              <th>Batch</th>
              <th>Machine</th>
              <th>Total Qty</th>
              <th>OK Qty</th>
              <th>Not OK Qty</th>
            </tr>
          </thead>
          <tbody>
            {batchRows.map((row) => (
              <tr key={row.batch}>
                <td>{row.shift}</td>
                <td>{row.batch}</td>
                <td>{row.machine}</td>
                <td>{row.total}</td>
                <td>{row.ok}</td>
                <td>{row.notOk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
