import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin text-primary ${sizeClasses[size]} ${className}`} />
  );
}