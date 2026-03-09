import { useState } from 'react';

const machinePrograms = {
  'INDUCTION -01': {
    runNo: '0001',
    programNo: 'PRG-101',
    leftFields: [
      ['POWER 1', '67'],
      ['HEAT TIME 1', '12.3'],
      ['POWER 2', '64'],
      ['HEAT TIME 2', '11.8'],
      ['QUENCH TIME', '7.1'],
      ['SOAK TIME', '8.5'],
    ],
    rightFields: [
      ['HOME POS', '10.0'],
      ['HOME POS FEED', '12000'],
      ['HEAT POS', '24.5'],
      ['HEAT POS FEED', '15000'],
      ['QUENCH POS', '35.0'],
      ['QUENCH POS FEED', '14000'],
      ['Q.DELAY/ADV TIME', '1.2'],
      ['H/OFF DELAY', '0.8'],
    ],
  },
  'INDUCTION-02': {
    runNo: '0002',
    programNo: 'PRG-202',
    leftFields: [
      ['POWER 1', '62'],
      ['HEAT TIME 1', '11.9'],
      ['POWER 2', '60'],
      ['HEAT TIME 2', '11.5'],
      ['QUENCH TIME', '7.4'],
      ['SOAK TIME', '8.2'],
    ],
    rightFields: [
      ['HOME POS', '11.0'],
      ['HOME POS FEED', '11800'],
      ['HEAT POS', '23.8'],
      ['HEAT POS FEED', '14800'],
      ['QUENCH POS', '34.2'],
      ['QUENCH POS FEED', '13900'],
      ['Q.DELAY/ADV TIME', '1.0'],
      ['H/OFF DELAY', '0.9'],
    ],
  },
};

function ProgramField({ label, value }) {
  const numericValue = Number.parseFloat(value) || 0;

  return (
    <div className="program-field-row">
      <span className="program-label">{label}</span>
      <input
        className="program-number-input"
        type="number"
        defaultValue={numericValue}
      />
    </div>
  );
}

export default function HeatProgramPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDUCTION -01');
  const selectedProgram = machinePrograms[selectedMachine] ?? machinePrograms['INDUCTION -01'];

  return (
    <section>
      <div className="table-card">
        <div className="program-top-row">
          <h2>PROGRAM</h2>
          <div className="program-record-row">
            <label htmlFor="programMachine" className="program-label">Machine:</label>
            <select
              id="programMachine"
              value={selectedMachine}
              onChange={(e) => setSelectedMachine(e.target.value)}
            >
              {Object.keys(machinePrograms).map((machine) => (
                <option key={machine} value={machine}>
                  {machine}
                </option>
              ))}
            </select>
            <label htmlFor="runNo" className="program-label">Run:</label>
            <input key={`run-${selectedMachine}`} id="runNo" defaultValue={selectedProgram.runNo} />
            <label htmlFor="programNo" className="program-label">Program:</label>
            <input key={`program-${selectedMachine}`} id="programNo" defaultValue={selectedProgram.programNo} />
          </div>
        </div>

        <div className="program-grid-two-col">
          <div>
            {selectedProgram.leftFields.map((item) => (
              <ProgramField key={`${selectedMachine}-${item[0]}`} label={item[0]} value={item[1]} />
            ))}
          </div>
          <div>
            {selectedProgram.rightFields.map((item) => (
              <ProgramField key={`${selectedMachine}-${item[0]}`} label={item[0]} value={item[1]} />
            ))}
          </div>
        </div>

        <div className="program-load-bottom">
          <button type="button" className="program-load-btn">LOAD</button>
          <button type="button" className="program-load-btn secondary">SAVE</button>
        </div>
      </div>
    </section>
  );
}
