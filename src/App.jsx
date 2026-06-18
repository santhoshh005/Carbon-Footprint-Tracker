import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoleculeBackground from './components/MoleculeBackground';
import { safeStorage } from './firebase/firebase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!safeStorage.getItem('carbonUser'));
  const [activeSection, setActiveSection] = useState('overview');

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <MoleculeBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
        <main className="flex-grow mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Home activeSection={activeSection} setActiveSection={setActiveSection} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />}
            />
            <Route
              path="*"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
