import { api } from '../../config/api';
import type { SessionStartRequest, SessionStartResponse, ExplainRequest, ExplainResponse, AnswerRequest, AnswerResponse } from '../../types/session';

export const sessionApi = {
  startSession: async (data: SessionStartRequest): Promise<SessionStartResponse> => {
    const response = await api.post('/sessions/start', data);
    return response.data;
  },
  
  explainTopic: async (data: ExplainRequest): Promise<ExplainResponse> => {
    const response = await api.post('/sessions/explain', data);
    return response.data;
  },
  
  answerQuestion: async (data: AnswerRequest): Promise<AnswerResponse> => {
    const response = await api.post('/sessions/answer', data);
    return response.data;
  },
  
  evaluateSession: async (sessionId: string): Promise<any> => {
    const response = await api.post('/sessions/evaluate', { session_id: sessionId });
    return response.data;
  }
};
