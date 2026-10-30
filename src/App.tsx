import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import NotesPage from './pages/NotesPage';
import QuizPage from './pages/QuizPage';
import SearchPage from './pages/SearchPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TopicsPage from './pages/TopicsPage';
import OfficialNotesPage from './pages/OfficialNotesPage';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DataProvider>
      <Layout>
        <Routes>
          <Route path="/" element={
            user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
          } />
          <Route path="/dashboard" element={
            user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />
          } />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/shared" element={<NotesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/official" element={<OfficialNotesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </DataProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
