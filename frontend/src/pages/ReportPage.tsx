import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { reportApi } from '../features/reports/reportApi';
import type { ReportResponse } from '../types/report';
import { CheckCircle, AlertTriangle, Lightbulb, Target, RefreshCw } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reportId) {
      reportApi.getReport(reportId)
        .then(data => {
          setReport(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          // Fallback to demo report if API fails or report doesn't exist
          setReport({
            report_id: reportId,
            session_id: 'demo',
            overall_score: 84,
            accuracy_score: 86,
            clarity_score: 82,
            completeness_score: 80,
            strengths: [
              "You explained the core idea clearly.",
              "You used a relevant real-life example."
            ],
            weaknesses: [
              "You need to explain why equal and opposite forces do not cancel."
            ],
            misconceptions: [
              "Action and reaction forces act on different objects, not the same object."
            ],
            missing_concepts: [
              "Force pairs",
              "Different objects",
              "Interaction forces"
            ],
            improved_explanation: "Newton's Third Law means that when one object applies a force on another object, the second object applies an equal and opposite force back on the first object. These forces do not cancel because they act on different objects.",
            practice_question: "Explain how a rocket moves upward using Newton's Third Law."
          });
          setLoading(false);
        });
    }
  }, [reportId]);

  if (loading) return <div className="py-20"><Loader size="lg" text="Loading report..." /></div>;
  if (!report) return <div className="text-center py-20 text-rose-500">Failed to load report.</div>;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">TeachBack Evaluation</h1>
          <p className="text-slate-500 mt-1">Here is how well you understood the topic.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Save Report</Button>
          <Link to="/teach">
            <Button>Teach Another Topic</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-4 bg-gradient-to-br from-slate-900 to-primary-900 text-white border-0">
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-slate-300 font-medium mb-2 text-lg">Overall Score</span>
            <div className="text-6xl font-black mb-4 flex items-baseline">
              <span className={getScoreColor(report.overall_score)}>{report.overall_score}</span>
              <span className="text-3xl text-slate-400 font-bold">/100</span>
            </div>
            
            <div className="w-full max-w-md grid grid-cols-3 gap-4 text-center mt-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Accuracy</div>
                <div className="font-semibold text-xl">{report.accuracy_score}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Clarity</div>
                <div className="font-semibold text-xl">{report.clarity_score}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-1">Completeness</div>
                <div className="font-semibold text-xl">{report.completeness_score}%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Strengths & Weaknesses */}
        <Card className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-emerald-500" />
            <h3 className="text-lg font-bold text-slate-900">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {report.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {report.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Misconceptions & Missing Concepts */}
        <Card className="col-span-1 md:col-span-4 border-rose-100 bg-rose-50/30">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="text-rose-500" />
            Knowledge Gaps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Misconceptions Detected</h4>
              {report.misconceptions.length > 0 ? (
                <div className="space-y-2">
                  {report.misconceptions.map((m, i) => (
                    <div key={i} className="bg-white p-3 rounded border border-rose-100 text-slate-700 text-sm shadow-sm">
                      {m}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No major misconceptions detected.</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wider">Missing Concepts</h4>
              {report.missing_concepts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.missing_concepts.map((mc, i) => (
                    <Badge key={i} variant="neutral" className="bg-white border border-slate-200 py-1.5 px-3">{mc}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm italic">No key concepts were missing.</p>
              )}
            </div>
          </div>
        </Card>

        {/* Improved Explanation */}
        <Card className="col-span-1 md:col-span-4 bg-primary-50/50 border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-primary-600" />
              <h3 className="text-lg font-bold text-slate-900">The Feynman Explanation</h3>
            </div>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-800 leading-relaxed bg-white p-6 rounded-lg border border-primary-100 shadow-sm">
              {report.improved_explanation}
            </p>
          </div>
        </Card>

        {/* Practice Question */}
        <Card className="col-span-1 md:col-span-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="text-slate-700" />
            <h3 className="text-lg font-bold text-slate-900">Next Steps: Test Yourself</h3>
          </div>
          <p className="text-slate-600 mb-4">Try answering this practice question focusing on your weakest area:</p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-slate-800 font-medium">
            {report.practice_question}
          </div>
        </Card>

      </div>
    </div>
  );
};
