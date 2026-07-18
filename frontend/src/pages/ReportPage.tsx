import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { reportApi } from '../features/reports/reportApi';
import type { ReportResponse } from '../types/report';
import { RefreshCw } from 'lucide-react';
import { ScoreBreakdown } from '../components/report/ScoreBreakdown';
import { MisconceptionRadar } from '../components/report/MisconceptionRadar';
import { ExplanationComparison } from '../components/report/ExplanationComparison';
import { KnowledgeGapMap } from '../components/report/KnowledgeGapMap';
import { RevisionCards } from '../components/report/RevisionCards';
import { ConfidenceInsight } from '../components/report/ConfidenceInsight';
import { AnimatedPageShell } from '../components/layout/AnimatedPageShell';

export const ReportPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);

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
            practice_question: "Explain how a rocket moves upward using Newton's Third Law.",
            example_quality_score: 85,
            subject: "Physics",
            topic: "Newton's Third Law",
            student_explanation: "When you push something it pushes back with the same force. That is why if I push a wall, the wall pushes me.",
            confidence_before: 3,
            revision_cards: [
              { question: "Why do action and reaction forces not cancel?", answer: "Because they act on different objects." }
            ]
          });
          setLoading(false);
        });
    }
  }, [reportId]);

  if (loading) return <div className="py-20"><Loader size="lg" text="Loading report..." /></div>;
  if (!report) return <div className="text-center py-20 text-rose-500">Failed to load report.</div>;

  const deriveExampleQuality = () => {
    if (report.example_quality_score) return report.example_quality_score;
    const mentionsExample = report.strengths.some(s => s.toLowerCase().includes('example'));
    if (mentionsExample) return 85;
    return Math.floor((report.clarity_score + report.completeness_score) / 2);
  };

  const deriveMisconceptionRisk = () => {
    const len = report.misconceptions.length;
    if (len === 0) return 'Low';
    if (len === 1) return 'Medium';
    return 'High';
  };

  const deriveImprovements = () => {
    const improvements = [];
    if (report.missing_concepts.length > 0) {
      improvements.push(`Added missing concepts: ${report.missing_concepts.join(', ')}`);
    }
    if (report.misconceptions.length > 0) {
      improvements.push("Corrected underlying misconceptions");
    }
    improvements.push("Improved clarity and structure");
    return improvements;
  };

  const deriveRevisionCards = () => {
    if (report.revision_cards && report.revision_cards.length > 0) {
      return report.revision_cards;
    }
    return [
      {
        question: "What is the key takeaway from this topic?",
        answer: "Review the improved explanation to see the core concepts clearly articulated.",
        category: "Summary"
      },
      {
        question: "Practice Question",
        answer: report.practice_question,
        category: "Practice"
      }
    ];
  };

  return (
    <AnimatedPageShell variant="report">
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">TeachBack Evaluation</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is how well you understood the topic.</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <Button variant="outline" onClick={() => window.print()}>Save as PDF</Button>
          <Link to="/teach">
            <Button>Teach Another Topic</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analytics & Metrics */}
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <ScoreBreakdown 
            overall={report.overall_score}
            accuracy={report.accuracy_score}
            clarity={report.clarity_score}
            completeness={report.completeness_score}
            exampleQuality={deriveExampleQuality()}
            misconceptionRisk={deriveMisconceptionRisk()}
          />
          {report.confidence_before !== undefined && (
            <ConfidenceInsight 
              confidenceBefore={report.confidence_before} 
              overallScore={report.overall_score} 
            />
          )}
          
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Misconception Radar</h3>
            <MisconceptionRadar 
              misconceptions={report.misconceptions}
              weaknesses={report.weaknesses}
            />
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCw className="text-primary-600" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Revision Cards</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Review these flashcards to solidify your understanding.</p>
            <RevisionCards cards={deriveRevisionCards()} />
          </Card>
          
        </div>
        
        {/* Right Column: Detailed Feedback & Study Material */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Explanation Analysis</h3>
            <ExplanationComparison 
              original={report.student_explanation}
              improved={report.improved_explanation}
              improvements={deriveImprovements()}
            />
          </Card>
          
          <KnowledgeGapMap 
            topic={report.topic || "Current Topic"}
            understood={report.strengths}
            partial={report.weaknesses}
            missing={report.missing_concepts}
            misconceptions={report.misconceptions}
          />

        </div>
      </div>
    </div>
    </AnimatedPageShell>
  );
};
