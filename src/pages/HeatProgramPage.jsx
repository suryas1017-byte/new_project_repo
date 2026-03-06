const leftFields = [
  ['POWER 1', '000'],
  ['HEAT TIME 1', '00.0'],
  ['POWER 2', '000'],
  ['HEAT TIME 2', '00.0'],
  ['QUENCH TIME', '00.0'],
  ['SOAK TIME', '00.0'],
];

const rightFields = [
  ['HOME POS', '000.0'],
  ['HOME POS FEED', '00000'],
  ['HEAT POS', '000.0'],
  ['HEAT POS FEED', '00000'],
  ['QUENCH POS', '000.0'],
  ['QUENCH POS FEED', '00000'],
  ['Q.DELAY/ADV TIME', '00.0'],
  ['H/OFF DELAY', '00.0'],
];

function ProgramField({ label, value }) {
  return (
    <div className="program-field-row">
      <span className="program-label">{label}</span>
      <span className="program-value">{value}</span>
    </div>
  );
}

export default function HeatProgramPage() {
  return (
    <section>
      <div className="table-card">
        <div className="program-top-row">
          <h2>PROGRAM</h2>
          <div className="program-record-row">
            <label htmlFor="recordName" className="program-label">Record Name:</label>
            <input id="recordName" defaultValue="" />
            <label htmlFor="recordNo" className="program-label">No.:</label>
            <input id="recordNo" defaultValue="-----" />
          </div>
        </div>

        <div className="program-no-row">
          <span className="program-label">PROGRAM NO</span>
          <span className="program-value">0000000000</span>
        </div>

        <div className="program-grid-two-col">
          <div>
            {leftFields.map((item) => (
              <ProgramField key={item[0]} label={item[0]} value={item[1]} />
            ))}
          </div>
          <div>
            {rightFields.map((item) => (
              <ProgramField key={item[0]} label={item[0]} value={item[1]} />
            ))}
          </div>
        </div>

        <div className="program-load-bottom">
          <button type="button" className="program-load-btn">LOAD</button>
        </div>
      </div>
    </section>
  );
}
