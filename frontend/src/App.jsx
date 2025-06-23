import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// --- Page Imports ---
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeFeedbackHistory from './pages/EmployeeFeedbackHistory';
import FeedbackDetailPage from './pages/FeedbackDetailPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage.jsx';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerFeedbackHistory from './pages/ManagerFeedbackHistory';
import SignupPage from './pages/SignupPage.jsx';
import TeamMemberFeedbackPage from './pages/TeamMemberFeedbackPage.jsx';

// --- Component Imports ---
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- Theme Definition ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2dd4bf',
      light: '#5eead4',
      dark: '#14b8a6',
    },
    secondary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0d9488',
    },
    secondary: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#ea580c',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
  },
});

function App() {
  const [theme, setTheme] = React.useState(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document root
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <div className="app-container">
        <Router>
          <AuthProvider>
            <MainContent toggleTheme={toggleTheme} currentTheme={theme} />
          </AuthProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

function MainContent({ toggleTheme, currentTheme }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-4" style={{ width: '40px', height: '40px' }}></div>
                    <p className="text-secondary">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar toggleTheme={toggleTheme} currentTheme={currentTheme} />
            <main className="flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="min-h-full"
                >
                    <Routes>
                        <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === 'Manager' ? '/manager' : '/employee'} />} />
                        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'Manager' ? '/manager' : '/employee'} />} />
                        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to={user.role === 'Manager' ? '/manager' : '/employee'} />} />
                        <Route
                            path="/manager"
                            element={user && user.role === 'Manager' ? <ManagerDashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/team-member/:employeeId"
                            element={user && user.role === 'Manager' ? <TeamMemberFeedbackPage /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/employee"
                            element={user && user.role === 'Employee' ? <EmployeeDashboard /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/feedback/:id"
                            element={user ? <FeedbackDetailPage /> : <Navigate to="/login" />}
                        />
                        <Route path="/manager-feedback-history" element={user && user.role === 'Manager' ? <ManagerFeedbackHistory /> : <Navigate to="/login" />} />
                        <Route path="/employee-feedback-history" element={user && user.role === 'Employee' ? <EmployeeFeedbackHistory /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Navigate to={!user ? "/" : user.role === 'Manager' ? '/manager' : '/employee'} />} />
                    </Routes>
                </motion.div>
            </main>
        </>
    );
}


export default App;
