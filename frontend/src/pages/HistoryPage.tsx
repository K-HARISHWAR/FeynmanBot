import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const HistoryPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Session History</h1>
        <p className="text-slate-500 mt-2">Review your past explanations and feedback.</p>
      </div>

      <div className="space-y-4">
        {[
          { subject: 'Physics', topic: "Newton's Third Law", score: 85, date: '2026-07-05', id: 'mock-1' },
          { subject: 'Biology', topic: 'Photosynthesis', score: 92, date: '2026-07-04', id: 'mock-2' },
          { subject: 'Economics', topic: 'Supply and Demand', score: 76, date: '2026-07-03', id: 'mock-3' },
        ].map((session, i) => (
          <Card key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {session.subject}
                </span>
                <span className="text-sm text-slate-400">{session.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{session.topic}</h3>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Score</p>
                <p className={`text-xl font-bold ${session.score >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {session.score}%
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Report
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
