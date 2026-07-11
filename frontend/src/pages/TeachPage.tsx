import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TextArea } from '../components/common/TextArea';
import { Loader } from '../components/common/Loader';
import { sessionApi } from '../features/sessions/sessionApi';
import { Brain, Send } from 'lucide-react';

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
  
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic || explanation.length < 50) {
      setError("Please fill all fields. Explanation must be at least 50 characters.");
      return;
    }
    
    setError('');
    
    setLoading(true);
    try {
      const startRes = await sessionApi.startSession({ user_id: "demo-user", subject, topic });
      setSessionId(startRes.session_id);
      
      const explainRes = await sessionApi.explainTopic({
        session_id: startRes.session_id,
        subject,
        topic,
        student_explanation: explanation
      });
      
      setCurrentQuestion(explainRes.question);
      setQuestionNumber(explainRes.question_number);
      setStep('qa');
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
    
    try {
      const res = await sessionApi.answerQuestion({
        session_id: sessionId,
        question: currentQuestion,
        student_answer: answer,
        question_number: questionNumber
      });
      
      if (res.is_final_question) {
        setStep('evaluating');
        const evalRes = await sessionApi.evaluateSession(sessionId);
        navigate(`/report/${evalRes.id}`);
      } else {
        setCurrentQuestion(res.next_question!);
        setQuestionNumber(res.question_number);
        setAnswer('');
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 'evaluating') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="FeynmanBot is evaluating your understanding..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Teach FeynmanBot</h1>
        <p className="text-slate-500 mt-2">Explain the concept as simply as you can.</p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {step === 'init' && (
        <Card className="shadow-lg border-primary-100">
          <form onSubmit={handleStart} className="space-y-6">
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
            
            <TextArea 
              label="Your Explanation" 
              value={explanation} 
              onChange={e => setExplanation(e.target.value)} 
              placeholder="Explain the topic as if I am a complete beginner..."
              className="min-h-[200px]"
              required 
            />
            
            <div className="flex justify-end">
              <Button type="submit" size="lg" isLoading={loading} className="w-full sm:w-auto">
                Teach FeynmanBot <Send className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {step === 'qa' && (
        <div className="space-y-6">
          <Card className="bg-primary-50 border-primary-100">
            <div className="flex items-start gap-4">
              <div className="bg-primary-600 p-2 rounded-lg mt-1 shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-primary-800 mb-1">
                  FeynmanBot (Question {questionNumber} of 3)
                </h3>
                <p className="text-slate-800 text-lg leading-relaxed">
                  {currentQuestion}
                </p>
              </div>
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
