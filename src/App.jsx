import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudyCenterPage } from './pages/StudyCenterPage';
import { AdminPage } from './pages/AdminPage';

const MainLayout = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isNewNoteOpen, setIsNewNoteOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenNewNote={() => {
          setCurrentTab('dashboard');
          setIsNewNoteOpen(true);
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Tab Content */}
      <div style={{ flex: 1 }}>
        {currentTab === 'dashboard' && (
          <DashboardPage
            isNewNoteModalOpen={isNewNoteOpen}
            onCloseNewNoteModal={() => setIsNewNoteOpen(false)}
          />
        )}
        {currentTab === 'study' && <StudyCenterPage />}
        {currentTab === 'admin' && (isAdmin ? <AdminPage /> : <DashboardPage />)}
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
