import { useMemo, useState } from 'react';

const machineList = ['INDUCITON -01', 'INDUCTION-02'];

const inputTags = [
  'AIR PRESSURE',
  'RESET',
  'CYCLE START PB',
  'EMERGENCY OK',
  'DM MPCB OVERLOAD',
  'DM PUMP ON CFM',
  'Q.PUMP MPCB OVERLOAD',
  'Q.PUMP ON CFM',
  'LUBE LEVEL',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'ROT MPCB OVERLOAD',
  'JOB ROT CFM',
  'DOOR CLOSE',
  'PART PRESENT',
  'QUENCH LEVEL LOW',
  'OVER TEMP TRIP',
  'COOLING FLOW OK',
  'POWER HEALTHY',
  'RECIPE READY',
  'PRESSURE LOW',
  'HYDRAULIC OK',
  'SERVO READY',
  'HOME SENSOR',
  'HEAT POS SENSOR',
  'QUENCH POS SENSOR',
  'SPARE',
];

const outputTags = [
  'DM PUMP START',
  'Q.PUMP START',
  'COIL ENABLE',
  'HEAT CONTACTOR',
  'ROT MOTOR START',
  'BUZZER',
  'GREEN LAMP',
  'RED LAMP',
  'YELLOW LAMP',
  'QUENCH VALVE',
  'AIR VALVE',
  'HYDRAULIC VALVE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
  'SPARE',
];

function machineSeed(machine) {
  return Number(machine.split('-')[1]) || 1;
}

function makeRows(tags, prefix, startByte, machine) {
  const seed = machineSeed(machine);
  return tags.map((name, idx) => {
    const byte = Math.floor(idx / 8) + startByte;
    const bit = idx % 8;
    return {
      point: `${prefix}${byte}.${bit}`,
      name,
      status: (idx + seed) % 3 === 0 ? 'ON' : 'OFF',
    };
  });
}

export default function IoStatusPage() {
  const [selectedMachine, setSelectedMachine] = useState('INDUCITON -01');
  const [type, setType] = useState('inputs');

  const inputRows = useMemo(
    () => makeRows(inputTags, 'I', 0, selectedMachine),
    [selectedMachine]
  );
  const outputRows = useMemo(
    () => makeRows(outputTags, 'Q', 0, selectedMachine),
    [selectedMachine]
  );

  const rows = type === 'inputs' ? inputRows : outputRows;

  return (
    <section>
      <h2>I/O Status</h2>
      <div className="actions-row">
        <label htmlFor="io-machine-select">Machine</label>
        <select
          id="io-machine-select"
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
        >
          {machineList.map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={type === 'inputs' ? '' : 'secondary'}
          onClick={() => setType('inputs')}
        >
          Inputs (30)
        </button>
        <button
          type="button"
          className={type === 'outputs' ? '' : 'secondary'}
          onClick={() => setType('outputs')}
        >
          Outputs (26)
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Machine</th>
              <th>Point</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${selectedMachine}-${row.point}`}>
                <td>{selectedMachine}</td>
                <td>{row.point}</td>
                <td>{row.name}</td>
                <td>
                  <span className="io-status">
                    <span className={row.status === 'ON' ? 'io-lamp on' : 'io-lamp off'} />
                    <span className={row.status === 'ON' ? 'io-pill on' : 'io-pill off'}>
                      {row.status}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


