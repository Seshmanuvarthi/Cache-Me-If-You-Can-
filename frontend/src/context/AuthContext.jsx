import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('squidToken');
    const savedTeam = localStorage.getItem('squidTeam');
    if (token && savedTeam) {
      setTeam(JSON.parse(savedTeam));
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/api/game/status');
      setProgress(res.data);
    } catch (err) {
      console.error('Progress fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (teamId, password) => {
    const res = await api.post('/api/auth/login', { teamId, password });
    const { token, teamId: tid, progress: prog } = res.data;
    localStorage.setItem('squidToken', token);
    localStorage.setItem('squidTeam', JSON.stringify({ teamId: tid }));
    setTeam({ teamId: tid });
    setProgress(prog);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('squidToken');
    localStorage.removeItem('squidTeam');
    setTeam(null);
    setProgress(null);
  };

  const refreshProgress = async () => {
    await fetchProgress();
  };

  return (
    <AuthContext.Provider value={{ team, progress, loading, login, logout, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
