import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { api } from '../config/api';
import { Loader } from '../components/common/Loader';
import { AnimatedPageShell } from '../components/layout/AnimatedPageShell';

interface HistorySession {
  session_id: string;
  report_id: string;
  subject: string;
  topic: string;
  score: number;
  created_at: string;
}

interface HistoryResponse {
  sessions: HistorySession[];
}

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<HistoryResponse>('/history/me')
      .then(res => {
        setHistory(res.data.sessions);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('History data is unavailable.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <AnimatedPageShell variant="history">
        <div className="py-20 flex justify-center"><Loader size="lg" text="Loading history..." /></div>
      </AnimatedPageShell>
    );
  }

  if (error) {
    return (
      <AnimatedPageShell variant="history">
        <div className="py-20 text-center text-rose-500">{error}</div>
      </AnimatedPageShell>
    );
  }

  if (history.length === 0) {
    return (
      <AnimatedPageShell variant="history">
        <div className="max-w-4xl mx-auto space-y-8 text-center py-20">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Session History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">No learning history yet. Complete a TeachBack session to see it here.</p>
        </div>
      </AnimatedPageShell>
    );
  }

  return (
    <AnimatedPageShell variant="history">
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Session History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Review your past explanations and feedback.</p>
      </div>

      <div className="space-y-4">
        {history.map((session, i) => (
          <Card key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:-translate-y-1 hover:shadow-md hover:border-primary-200 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                  {session.subject}
                </span>
                <span className="text-sm text-slate-400">{new Date(session.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.topic}</h3>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Score</p>
                <p className={`text-xl font-bold ${session.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {session.score}%
                </p>
              </div>
              <Link to={`/report/${session.report_id}`}>
                <Button variant="outline" size="sm">
                  View Report
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </AnimatedPageShell>
  );
};
