export interface Task {
  title: string;
  description: string;
  date: string;
  assignees: string;
  status: 'to do' | 'in progress' | 'in review' | 'completed';
}
