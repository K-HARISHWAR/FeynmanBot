import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedPageShell } from '../components/layout/AnimatedPageShell';
import { Button } from '../components/common/Button';
import { Brain, MessageSquare, Target, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <AnimatedPageShell variant="landing" className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-6">
          <Brain className="h-12 w-12 text-primary-600" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Teach the AI. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
            Discover what you truly understand.
          </span>
        </h1>
        <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          The best way to learn is to teach. FeynmanBot acts as a curious beginner, 
          asking follow-up questions to expose the gaps in your knowledge and give you actionable feedback.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/teach">
            <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
              Start Teaching
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <MessageSquare className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">AI Beginner Student</h3>
          <p className="text-slate-600">Explain topics to an AI that acts like a curious beginner trying to understand your logic.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <Zap className="text-purple-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Follow-up Questioning</h3>
          <p className="text-slate-600">The AI asks targeted questions to poke holes in your explanation and test your depth.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
            <Target className="text-rose-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Misconception Detection</h3>
          <p className="text-slate-600">Instantly identify logical flaws, missing concepts, and inaccuracies in your knowledge.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
            <Brain className="text-emerald-600 w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Personalized Feedback</h3>
          <p className="text-slate-600">Get a comprehensive TeachBack score, improved explanations, and practice questions.</p>
        </div>
      </section>
    </AnimatedPageShell>
  );
};
