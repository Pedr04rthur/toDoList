import { Injectable, signal } from '@angular/core';
import { Task, TaskStatus } from '../models/task.model';

const STORAGE_KEY = 'app_task_manager_tasks_v1';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSignal = signal<Task[]>(this.loadTasks());

  constructor() {
    this.seedTasksIfEmpty();
  }

  getTasks() {
    return this.tasksSignal.asReadonly();
  }

  private loadTasks(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to load tasks', e);
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this.tasksSignal.set([...tasks]);
  }

  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  private addDaysISO(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  private seedTasksIfEmpty(): void {
    const currentTasks = this.tasksSignal();
    if (currentTasks.length === 0) {
      const tasks: Task[] = [
        {
          id: this.uid(),
          title: 'Ler capítulo 3 de Algoritmos',
          due: this.addDaysISO(2),
          level: 'high',
          desc: 'Priorizar exercícios 3.1-3.5',
          status: 'todo'
        },
        {
          id: this.uid(),
          title: 'Resolver lista de TS',
          due: this.addDaysISO(5),
          level: 'medium',
          desc: 'Atenção a generics',
          status: 'doing'
        },
        {
          id: this.uid(),
          title: 'Revisão rápida: HTML/CSS',
          due: this.addDaysISO(10),
          level: 'low',
          desc: '30 minutos',
          status: 'done'
        }
      ];
      this.saveTasks(tasks);
    }
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const newTask: Task = {
      ...task,
      id: this.uid(),
      createdAt: new Date()
    };
    const updatedTasks = [...this.tasksSignal(), newTask];
    this.saveTasks(updatedTasks);
  }

  updateTask(id: string, updates: Partial<Task>): void {
    const updatedTasks = this.tasksSignal().map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    this.saveTasks(updatedTasks);
  }

  deleteTask(id: string): void {
    const updatedTasks = this.tasksSignal().filter(task => task.id !== id);
    this.saveTasks(updatedTasks);
  }

  moveTask(id: string, newStatus: TaskStatus): void {
    this.updateTask(id, { status: newStatus });
  }

  getProximityColor(dueISO: string): string {
    const today = new Date();
    const due = new Date(dueISO);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return 'bg-gray-500';
    if (diff <= 1) return 'bg-red-500';
    if (diff <= 3) return 'bg-orange-400';
    if (diff <= 7) return 'bg-yellow-300';
    return 'bg-green-400';
  }

  getLevelLabel(level: 'low' | 'medium' | 'high'): string {
    return level === 'high' ? 'Alta' : level === 'medium' ? 'Média' : 'Baixa';
  }
}