import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Button } from '@/components/ui/button';
import { RoleSelector } from '@/components/auth/RoleSelector';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setMode('register');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && !selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome to LUMA</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to continue your learning journey
            </p>
            <LoginForm />
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                onClick={() => setMode('select-role')}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </motion.div>
        )}

        {mode === 'select-role' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Join LUMA</h1>
              <p className="text-muted-foreground">
                Select your role to get started
              </p>
            </div>
            <RoleSelector onSelectRole={handleRoleSelect} />
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setMode('login')}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </motion.div>
        )}

        {mode === 'register' && selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm selectedRole={selectedRole} />
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setMode('login');
                  setSelectedRole(null);
                }}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}