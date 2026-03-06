const steps = [
  ['Preheat', 'Done', '180 sec'],
  ['Heat', 'Running', '420 sec'],
  ['Hold', 'Pending', '300 sec'],
  ['Cool', 'Pending', '240 sec'],
];

export default function HeatProgramPage() {
  return (
    <section>
      <h2>Heat Program</h2>
      <div className="kpi-grid">
        <article className="card"><h3>Program</h3><p>Case Hardening V2</p></article>
        <article className="card"><h3>Version</h3><p>3.4</p></article>
        <article className="card"><h3>Current Step</h3><p>Heat</p></article>
        <article className="card"><h3>Remaining Time</h3><p>14:23</p></article>
      </div>
      <div className="table-card">
        <table>
          <thead><tr><th>Step</th><th>Status</th><th>Duration</th></tr></thead>
          <tbody>
            {steps.map((s) => (
              <tr key={s[0]}><td>{s[0]}</td><td>{s[1]}</td><td>{s[2]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
