const alarms = [
  ['A-101', 'High Cycle Time', 'Medium', '10:25'],
  ['A-077', 'Cooling Delay', 'High', '10:13'],
  ['A-049', 'Door Open Timeout', 'Low', '09:58'],
];

export default function AlarmsPage() {
  return (
    <section>
      <h2>Alarms & History</h2>
      <div className="kpi-grid">
        <article className="card"><h3>Active Alarms</h3><p>3</p></article>
        <article className="card"><h3>Critical</h3><p>0</p></article>
        <article className="card"><h3>MTTR</h3><p>08:12</p></article>
        <article className="card"><h3>Today Total</h3><p>19</p></article>
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>ID</th><th>Alarm</th><th>Severity</th><th>Time</th></tr></thead>
          <tbody>
            {alarms.map((a) => (
              <tr key={a[0]}><td>{a[0]}</td><td>{a[1]}</td><td>{a[2]}</td><td>{a[3]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
