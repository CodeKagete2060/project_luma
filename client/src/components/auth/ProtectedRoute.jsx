import React from 'react';
import { useLocation, useNavigate } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ component: Component, roles = [], ...rest }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [location] = useLocation();

  React.useEffect(() => {
    if (!loading && !user) {
      // Save the attempted URL for redirecting post-login
      localStorage.setItem('redirectUrl', location);
      navigate('/login');
    }

    if (user && roles.length && !roles.includes(user.role)) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [user, loading, roles, location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (roles.length && !roles.includes(user.role)) {
    return null;
  }

  return <Component {...rest} />;
}