import React from 'react';
import { Card } from '../components/common/Card';
import { BookOpen, Target, Clock, Trophy } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
        <p className="text-slate-500 mt-2">Track your teaching progress and mastery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Sessions</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-slate-900">84%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Best Subject</p>
            <p className="text-2xl font-bold text-slate-900">Physics</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Study Time</p>
            <p className="text-2xl font-bold text-slate-900">4.2h</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mt-12 mb-4">Recent Sessions</h2>
      <Card className="overflow-hidden p-0">
        <div className="divide-y divide-slate-100">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-semibold text-slate-900">Newton's Third Law</p>
              <p className="text-sm text-slate-500">Physics</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-600">85%</p>
              <p className="text-xs text-slate-400">2 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-semibold text-slate-900">Photosynthesis</p>
              <p className="text-sm text-slate-500">Biology</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-600">92%</p>
              <p className="text-xs text-slate-400">Yesterday</p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div>
              <p className="font-semibold text-slate-900">Supply and Demand</p>
              <p className="text-sm text-slate-500">Economics</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-amber-600">76%</p>
              <p className="text-xs text-slate-400">2 days ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
