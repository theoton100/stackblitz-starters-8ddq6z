export type LifeArea = 'Family' | 'Finances' | 'Relationship' | 'Faith' | 'Health' | 'Purpose';

export interface Task {
  id: string;
  title: string;
  description?: string;
  responsibilities: string;
  results: string;
  user_id: string;
  responsibilities_completed: boolean;
  results_completed: boolean;
  tags: LifeArea[];
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  responsibilities: string;
  results: string;
  tags: LifeArea[];
}