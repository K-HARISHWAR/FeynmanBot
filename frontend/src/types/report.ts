export interface ReportResponse {
  report_id: string;
  session_id: string;
  overall_score: number;
  accuracy_score: number;
  clarity_score: number;
  completeness_score: number;
  strengths: string[];
  weaknesses: string[];
  misconceptions: string[];
  missing_concepts: string[];
  improved_explanation: string;
  practice_question: string;
  example_quality_score?: number;
  revision_cards?: { question: string; answer: string; category?: string }[];
  concept_map?: any;
  student_explanation?: string;
  subject?: string;
  topic?: string;
  confidence_before?: number;
  ai_mode?: string;
}
