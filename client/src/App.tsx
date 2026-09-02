import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CustomerInputPage } from './pages/CustomerInputPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { AutomationLogPage } from './pages/AutomationLogPage';
import { UserGuidePage } from './pages/UserGuidePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/new-case" element={<CustomerInputPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/automation-logs" element={<AutomationLogPage />} />
          <Route path="/guide" element={<UserGuidePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
