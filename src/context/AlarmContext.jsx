import { createContext, useContext, useMemo, useState } from 'react';

const alarmTexts = [
  'EMERGENCY STOP PRESSED I 0.3',
  'DM PUMP OVERLOAD I 0.4',
  'DM PUMP NOT ON I 0.5',
  'QUENCH PUMP OVERLOAD I 0.6',
  'QUENCH PUMP NOT ON I 0.7',
  'LUBE PUMP OVERLOAD I 3.3',
  'LUBE PUMP NOT ON I 3.4',
  'SERVO OVERLOAD I 3.2',
  'POWER SUPPLY FAULT I 3.5',
  'SERVO LIMIT PLUS I 3.6',
  'SERVO LIMIT MINUS I 3.7',
  'JOB ROTATION OVERLOAD I 2.0',
  'JOB ROTATION NOT ON I 2.1',
  'HEATER OVERLOAD I 2.2',
  'HEATER NOT ON I 2.3',
  'INDEX OVERLOAD I 2.5',
  'INDEX NOT ON I 2.5',
  'INDEX NOT IN HOME I 2.7',
  'INDEX NOT IN CAM I 2.6',
  'AXIS NOT IN HOME',
  'AXIS NOT IN SAFE POS',
  'SELECT AUTO MODE',
  'SELECT MANUAL MODE',
  'ENERGY LOW',
  'HEAT TIME LOW',
  'QUENCH TIME LOW',
  'QUENCH FLOW LOW',
  'ENERGY HIGH',
  'HEAT TIME HIGH',
  'QUENCH TIME HIGH',
  'QUENCH FLOW HIGH',
  'CYCLE TIME LOW',
  'CYCLE TIME HIGH',
  'QUENCH TEMPERATURE LOW',
  'QUENCH TEMPERATURE HIGH',
  'AXIS NOT ENABLE',
  'AXIS SOFT LIMIT PLUS',
  'AXIS SOFT LIMIT MINUS',
  'ENERGY SAVER ON Y2.6',
  'AIR PRESSURE NOT OK I 0.0',
  'HEATDEFEAT SELECTED',
  'AXIS REF NOT OK',
  'HEATTIME2 LOW',
  'HEATTIME2 HIGH',
  'SOAKTIME LOW',
  'SOAKTIME HIGH',
  'DM LEVEL LOW',
  'QUENCH LEVEL LOW',
  'DATA RECORD NOT STARTED',
  'HMI COMMUNICATION ERROR',
  'LUBE LEVEL LOW I 11.0',
];

function inferSeverity(text) {
  if (text.includes('ERROR') || text.includes('FAULT') || text.includes('OVERLOAD') || text.includes('NOT OK')) {
    return 'High';
  }

  if (text.includes('HIGH')) return 'High';
  if (text.includes('LOW')) return 'Low';
  return 'Medium';
}

const initialAlarms = alarmTexts.map((alarm, index) => ({
  id: `A-${String(index + 1).padStart(3, '0')}`,
  alarm,
  severity: inferSeverity(alarm),
  time: '--:--',
  critical: false,
  active: true,
}));

const AlarmContext = createContext(null);

export function AlarmProvider({ children }) {
  const [alarms, setAlarms] = useState(initialAlarms);

  function toggleCritical(id) {
    setAlarms((prev) =>
      prev.map((row) => (row.id === id ? { ...row, critical: !row.critical } : row))
    );
  }

  function clearAlarm(id) {
    setAlarms((prev) =>
      prev.map((row) => (row.id === id ? { ...row, active: false, critical: false } : row))
    );
  }

  const activeAlarms = useMemo(() => alarms.filter((row) => row.active), [alarms]);
  const historyAlarms = useMemo(() => alarms.filter((row) => !row.active), [alarms]);
  const selectedActiveAlarms = useMemo(
    () => activeAlarms.filter((row) => row.critical),
    [activeAlarms]
  );

  const value = {
    alarms,
    activeAlarms,
    historyAlarms,
    selectedActiveAlarms,
    toggleCritical,
    clearAlarm,
  };

  return <AlarmContext.Provider value={value}>{children}</AlarmContext.Provider>;
}

export function useAlarms() {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarms must be used within AlarmProvider');
  }

  return context;
}


