export interface SessionStartRequest {
  user_id?: string;
  subject: string;
  topic: string;
  ai_mode?: string;
  confidence_before?: number;
}

export interface SessionStartResponse {
  session_id: string;
  message: string;
}

export interface ExplainRequest {
  session_id: string;
  subject: string;
  topic: string;
  student_explanation: string;
  ai_mode?: string;
}

export interface ExplainResponse {
  question: string;
  question_number: number;
}

export interface AnswerRequest {
  session_id: string;
  question: string;
  student_answer: string;
  question_number: number;
  ai_mode?: string;
}

export interface AnswerResponse {
  next_question: string | null;
  question_number: number;
  is_final_question: boolean;
  message?: string;
}

export interface EvaluateRequest {
  session_id: string;
  ai_mode?: string;
  confidence_before?: number;
}
