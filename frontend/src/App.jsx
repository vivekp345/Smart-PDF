import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import SummaryPage from './pages/SummaryPage'; 
import HistoryPage from './pages/HistoryPage'; // <-- Import Real Page
import ProfilePage from './pages/ProfilePage'; // <-- Import Real Pag
import BotPage from './pages/BotPage';

// Placeholders for future phases


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* --- Private Routes --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* Real Pages */}
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bot" element={<BotPage />} />
         
          
          
          </Route>
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<div className="text-white">404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;