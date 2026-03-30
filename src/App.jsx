import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return null;
  if (['/login', '/register', '/onboarding'].includes(location.pathname)) return null;

  const navItems = [
    { to: '/home', label: 'Play', icon: '🎮' },
    { to: '/dashboard', label: 'Stats', icon: '🏆' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-slate-200 shadow-[0_4px_0_0_rgba(226,232,240,1)] px-4 mb-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-20">
        <Link to="/home" className="flex items-center gap-3 no-underline group">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-xl text-white shadow-[0_4px_0_0_#2563eb] group-hover:translate-y-1 group-hover:shadow-[0_0px_0_0_#2563eb] transition-all">
            🦉
          </div>
          <span className="font-black text-slate-800 text-2xl hidden sm:block tracking-tight">MicroLearn</span>
        </Link>

        {/* Center Nav tabs like Duolingo */}
        <div className="flex items-center gap-2">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 md:px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                  isActive
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <span className="text-xl md:mr-2">{item.icon}</span>
                <span className="hidden md:inline text-lg">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1 font-bold text-orange-500 text-lg group cursor-help">
                <span className="text-2xl pt-1">🔥</span> {user.streak || 0}
              </div>
              <div className="flex items-center gap-1 font-bold text-blue-500 text-lg group cursor-help">
                <span className="text-xl">🌟</span> {user.xp || 0}
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); }}
            className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 flex items-center justify-center font-bold transition-all cursor-pointer"
            title="Log Out"
          >
            ❌
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/lesson/:id" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
