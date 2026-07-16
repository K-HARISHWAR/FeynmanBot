import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { BookOpen, Target, Clock, Trophy } from 'lucide-react';
import { api } from '../config/api';
import { Loader } from '../components/common/Loader';
import { AnimatedPageShell } from '../components/layout/AnimatedPageShell';

interface DashboardStats {
  total_sessions: number;
  average_score: number;
  best_subject: string;
  weakest_subject: string;
  recent_sessions: {
    session_id: string;
    subject: string;
    topic: string;
    score: number;
    created_at: string;
  }[];
}

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/demo-user')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Dashboard data is unavailable. Make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AnimatedPageShell variant="dashboard">
        <div className="py-20 flex justify-center"><Loader size="lg" text="Loading dashboard..." /></div>
      </AnimatedPageShell>
    );
  }

  if (error) {
    return (
      <AnimatedPageShell variant="dashboard">
        <div className="py-20 text-center text-rose-500">{error}</div>
      </AnimatedPageShell>
    );
  }

  if (!stats || stats.total_sessions === 0) {
    return (
      <AnimatedPageShell variant="dashboard">
        <div className="max-w-6xl mx-auto space-y-8 text-center py-20">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">No TeachBack sessions yet. Start your first session.</p>
        </div>
      </AnimatedPageShell>
    );
  }

  return (
    <AnimatedPageShell variant="dashboard">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Track your teaching progress and mastery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Sessions</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total_sessions}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.average_score}%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Best Subject</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.best_subject}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Weakest Subject</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.weakest_subject}</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-12 mb-4">Recent Sessions</h2>
      <Card className="overflow-hidden p-0">
        <div className="divide-y divide-slate-100">
          {stats.recent_sessions.map((session, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{session.topic}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{session.subject}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${session.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{session.score}%</p>
                <p className="text-xs text-slate-400">{new Date(session.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
    </AnimatedPageShell>
  );
};
