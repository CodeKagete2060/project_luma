import React, { Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import AIAssistant from './pages/AIAssistant';
import NotFound from './pages/not-found';

// Components
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { LoadingScreen } from './components/shared/Loading';

// Hooks
import { usePersistentSession } from './hooks/use-persistent-session';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function AppContent() {
  usePersistentSession();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Suspense fallback={<LoadingScreen />}>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/login" component={Login} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              component={() => (
                <ProtectedRoute 
                  component={Profile}
                  roles={['student', 'parent', 'tutor', 'admin']}
                />
              )} 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              component={() => (
                <ProtectedRoute 
                  component={StudentDashboard} 
                  roles={['student']} 
                />
              )} 
            />
            <Route 
              path="/student/ai-helper" 
              component={() => (
                <ProtectedRoute 
                  component={AIAssistant} 
                  roles={['student']} 
                />
              )} 
            />
            
            {/* Parent Routes */}
            <Route 
              path="/parent/dashboard" 
              component={() => (
                <ProtectedRoute 
                  component={ParentDashboard} 
                  roles={['parent']} 
                />
              )} 
            />
            
            {/* 404 Route */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" enableSystem>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;