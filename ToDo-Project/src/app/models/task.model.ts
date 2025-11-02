

export interface Task {
  id: string;
  title: string;
  due: string; 
  level: 'low' | 'medium' | 'high';
  desc: string;
  status: 'todo' | 'doing' | 'done';
  createdAt?: Date;
}

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskLevel = 'low' | 'medium' | 'high';