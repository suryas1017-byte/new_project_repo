import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ValidationPage from './pages/ValidationPage';
import ShiftReportPage from './pages/ShiftReportPage';
import RunStatusPage from './pages/RunStatusPage';
import HeatProgramPage from './pages/HeatProgramPage';
import IoStatusPage from './pages/IoStatusPage';
import AlarmsPage from './pages/AlarmsPage';
import { AlarmProvider } from './context/AlarmContext';

export default function App() {
  return (
    <AlarmProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/shift-report" element={<ShiftReportPage />} />
          <Route path="/run-status" element={<RunStatusPage />} />
          <Route path="/heat-program" element={<HeatProgramPage />} />
          <Route path="/io-status" element={<IoStatusPage />} />
          <Route path="/alarms" element={<AlarmsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AlarmProvider>
  );
}
