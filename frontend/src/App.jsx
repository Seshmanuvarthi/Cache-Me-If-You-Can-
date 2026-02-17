import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import RedGreen from './pages/RedGreen';
import Circle from './pages/Circle';
import Triangle from './pages/Triangle';
import Square from './pages/Square';
import Umbrella from './pages/Umbrella';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { team, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ minHeight: '100vh', color: 'var(--pink)', fontFamily: 'Bebas Neue, cursive', fontSize: '2rem' }}>Loading...</div>;
  return team ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/round/redgreen" element={<ProtectedRoute><RedGreen /></ProtectedRoute>} />
      <Route path="/round/circle" element={<ProtectedRoute><Circle /></ProtectedRoute>} />
      <Route path="/round/triangle" element={<ProtectedRoute><Triangle /></ProtectedRoute>} />
      <Route path="/round/square" element={<ProtectedRoute><Square /></ProtectedRoute>} />
      <Route path="/round/umbrella" element={<ProtectedRoute><Umbrella /></ProtectedRoute>} />
      <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="noise">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
