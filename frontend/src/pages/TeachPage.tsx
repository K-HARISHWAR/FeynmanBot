import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Loader } from '../components/common/Loader';
import { sessionApi } from '../features/sessions/sessionApi';
import { Send } from 'lucide-react';
import { AIStudentModeSelector } from '../components/teach/AIStudentModeSelector';
import { ExplainSimplerButton } from '../components/teach/ExplainSimplerButton';
import { LearningTimeline } from '../components/teach/LearningTimeline';
import { TeachModeStatus } from '../components/teach/TeachModeStatus';
import type { BotStatus } from '../components/teach/TeachModeStatus';

export const TeachPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'init' | 'qa' | 'evaluating'>('init');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  
  const [sessionId, setSessionId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState('');
  
  const [qaHistory, setQaHistory] = useState<{q: string, a: string}[]>([]);
  
  // New UI States
  const [aiMode, setAiMode] = useState('Friendly Beginner');
  const [confidenceBefore, setConfidenceBefore] = useState<number>(3);
  const [botStatus, setBotStatus] = useState<BotStatus>('idle');
  
  const getTimelineStep = () => {
    if (step === 'init') return explanation ? 1 : 0;
    if (step === 'qa') return questionNumber + 1; // 2, 3, 4
    if (step === 'evaluating') return 5;
    return 0;
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic || explanation.length < 50) {
      setError("Please fill all fields. Explanation must be at least 50 characters.");
      return;
    }
    
    setError('');
    
    setLoading(true);
    setBotStatus('listening');
    try {
      const startRes = await sessionApi.startSession({ user_id: "demo-user", subject, topic, ai_mode: aiMode, confidence_before: confidenceBefore });
      setSessionId(startRes.session_id);
      
      const explainRes = await sessionApi.explainTopic({
        session_id: startRes.session_id,
        subject,
        topic,
        student_explanation: explanation,
        ai_mode: aiMode
      });
      
      setCurrentQuestion(explainRes.question);
      setQuestionNumber(explainRes.question_number);
      setStep('qa');
      setBotStatus('ready');
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 500) {
          setError("Database error. Check backend terminal or Supabase table constraints.");
        } else if (err.response.status === 400) {
          setError(err.response.data?.detail || "Bad Request");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("Backend is not reachable. Please start FastAPI on port 8000.");
      }
      setBotStatus('idle');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.length < 10) {
      setError("Please provide a meaningful answer.");
      return;
    }
    setError('');
    
    setQaHistory([...qaHistory, { q: currentQuestion, a: answer }]);
    setLoading(true);
    setBotStatus('thinking');
    
    try {
      const res = await sessionApi.answerQuestion({
        session_id: sessionId,
        question: currentQuestion,
        student_answer: answer,
        question_number: questionNumber,
        ai_mode: aiMode
      });
      
      if (res.is_final_question) {
        setStep('evaluating');
        setBotStatus('evaluating');
        const evalRes = await sessionApi.evaluateSession({ session_id: sessionId, ai_mode: aiMode, confidence_before: confidenceBefore });
        navigate(`/report/${evalRes.id}`);
      } else {
        setCurrentQuestion(res.next_question!);
        setQuestionNumber(res.question_number);
        setAnswer('');
        setBotStatus('ready');
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit answer.");
      setBotStatus('confused');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'evaluating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <LearningTimeline currentStep={getTimelineStep()} />
        <TeachModeStatus status={botStatus} />
        <Loader size="lg" text="Generating your personalized report..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8 mt-4">
        <LearningTimeline currentStep={getTimelineStep()} />
      </div>
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Teach FeynmanBot</h1>
        <p className="text-slate-500 mt-3 text-lg">Explain the concept as simply as you can. True understanding is shown by simplicity.</p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {step === 'init' && (
        <>
          <AIStudentModeSelector selectedMode={aiMode} onSelectMode={setAiMode} disabled={loading} />
          
          <Card className="shadow-lg border-primary-100 overflow-hidden">
            <div className="bg-primary-50 p-6 border-b border-primary-100 mb-6">
              <TeachModeStatus status={botStatus} />
            </div>
            
            <form onSubmit={handleStart} className="space-y-6 px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Subject (e.g. Physics)" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  placeholder="Physics" 
                  required 
                />
                <Input 
                  label="Topic (e.g. Newton's Third Law)" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  placeholder="Newton's Third Law" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  How confident are you in this topic before starting? (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setConfidenceBefore(num)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        confidenceBefore === num 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            
              <TextArea 
                label="Your Explanation" 
                value={explanation} 
                onChange={e => setExplanation(e.target.value)} 
                placeholder="Explain the topic as if I am a complete beginner..."
                className="min-h-[200px]"
                required 
              />
              <ExplainSimplerButton />
              
              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" isLoading={loading} className="w-full sm:w-auto">
                  Teach FeynmanBot <Send className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
      
      {step === 'qa' && (
        <div className="space-y-6">
          <Card className="shadow-lg border-primary-100 overflow-hidden">
            <div className="bg-primary-50 p-6 border-b border-primary-100 mb-6">
              <TeachModeStatus status={botStatus} />
            </div>
            <div className="px-6 pb-6">
              <h3 className="text-sm font-semibold text-primary-800 mb-3 uppercase tracking-wider">
                Question {questionNumber} of 3
              </h3>
              <p className="text-slate-800 text-lg leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {currentQuestion}
              </p>
            </div>
          </Card>
          
          <Card>
            <form onSubmit={handleAnswer} className="space-y-4">
              <TextArea 
                label="Your Answer" 
                value={answer} 
                onChange={e => setAnswer(e.target.value)} 
                placeholder="Answer the question..."
                className="min-h-[150px]"
                required 
              />
              
              <div className="flex justify-end">
                <Button type="submit" isLoading={loading}>
                  Submit Answer <Send className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
