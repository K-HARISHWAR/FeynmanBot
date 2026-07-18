import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
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

interface IncompleteSession {
  session_id: string;
  subject: string;
  topic: string;
  created_at: string;
}

interface HistoryResponse {
  sessions: HistorySession[];
  incomplete_sessions: IncompleteSession[];
}

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [incomplete, setIncomplete] = useState<IncompleteSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredHistory = useMemo(() => {
    if (!debouncedQuery.trim()) return history;
    const lowerQuery = debouncedQuery.toLowerCase();
    return history.filter(s => 
      s.subject.toLowerCase().includes(lowerQuery) || 
      s.topic.toLowerCase().includes(lowerQuery)
    );
  }, [history, debouncedQuery]);

  const filteredIncomplete = useMemo(() => {
    if (!debouncedQuery.trim()) return incomplete;
    const lowerQuery = debouncedQuery.toLowerCase();
    return incomplete.filter(s => 
      s.subject.toLowerCase().includes(lowerQuery) || 
      s.topic.toLowerCase().includes(lowerQuery)
    );
  }, [incomplete, debouncedQuery]);

  useEffect(() => {
    api.get<HistoryResponse>('/history/me')
      .then(res => {
        setHistory(res.data.sessions);
        setIncomplete(res.data.incomplete_sessions || []);
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

  if (history.length === 0 && incomplete.length === 0) {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Session History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Review your past explanations and feedback.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Filter by subject or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {debouncedQuery && filteredIncomplete.length === 0 && filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No sessions match your search for "{debouncedQuery}".</p>
        </div>
      )}

      {filteredIncomplete.length > 0 && (
        <div className="space-y-4 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Ongoing Sessions
          </h2>
          {filteredIncomplete.map((session, i) => (
            <Card key={`inc-${i}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 border-amber-200 dark:border-amber-900/50 hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 transition-colors">
                    {session.subject} - In Progress
                  </span>
                  <span className="text-sm text-slate-400">{new Date(session.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.topic}</h3>
              </div>
              
              <div className="flex items-center">
                <Link to={`/teach?session_id=${session.session_id}`}>
                  <Button variant="primary" size="sm">
                    Resume Session
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredHistory.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Completed</h2>
        {filteredHistory.map((session, i) => (
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
      )}
    </div>
    </AnimatedPageShell>
  );
};
