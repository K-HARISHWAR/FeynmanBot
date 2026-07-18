import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { supabase } from '../config/supabaseClient';
import { AnimatedPageShell } from '../components/layout/AnimatedPageShell';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Upsert profile for the newly registered user (if possible on frontend)
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
        });
        
        if (profileError) {
          console.error("Profile save failed on frontend:", profileError);
        }
      }

      if (data.session) {
        navigate('/dashboard');
      } else {
        setSuccessMsg('Account created. Please check your email to confirm your account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPageShell variant="landing">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create an account</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Start your learning journey with FeynmanBot</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
            
            <Button type="submit" className="w-full mt-2" isLoading={loading}>
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </div>
        </Card>
      </div>
    </AnimatedPageShell>
  );
};
