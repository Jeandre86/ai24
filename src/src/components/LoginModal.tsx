import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleEmailAuth = async () => {
    try {
      setLoading(true);
      setError('');

      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setEmail('');
      setPassword('');
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered. Try signing in instead.');
        setIsSignUp(false);
      } else if (err.code === 'auth/user-not-found') {
        setError('Email not found. Create an account to sign up.');
        setIsSignUp(true);
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to authenticate');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-base rounded-lg transition-colors text-secondary hover:text-primary">
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-primary">Welcome to Mosaic</h2>
                <p className="text-secondary text-sm">
                  {isSignUp ? 'Create an account to get started' : 'Sign in to access exclusive features'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleEmailAuth()}
                  className="w-full px-4 py-2 bg-base border border-border rounded-lg text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                />
              </div>

              {/* Sign In/Up Button */}
              <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-accent text-white border border-accent rounded-xl py-3 font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>

              {/* Toggle Sign In / Sign Up */}
              <div className="text-center">
                <p className="text-sm text-secondary">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={toggleMode}
                    disabled={loading}
                    className="text-accent font-semibold hover:underline disabled:opacity-50">
                    {isSignUp ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>

              {/* Footer Text */}
              <p className="text-xs text-muted text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
