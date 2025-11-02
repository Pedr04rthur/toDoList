import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskColumnComponent } from './task-column/task-column.component';
import { TaskService } from './services/task.service';
import { Task, TaskStatus } from './models/task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, TaskColumnComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gerenciador de Tarefas - Estudos';
  
  private taskService = inject(TaskService);
  
  showModal = signal(false);
  editingTask = signal<Task | null>(null);
  
  tasks = signal<Task[]>([]);
  
  todoTasks = computed(() => this.tasks().filter(task => task.status === 'todo'));
  doingTasks = computed(() => this.tasks().filter(task => task.status === 'doing'));
  doneTasks = computed(() => this.tasks().filter(task => task.status === 'done'));

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const loadedTasks = this.taskService.getTasks();
    this.tasks.set(loadedTasks());
  }

  openModal(): void {
    this.editingTask.set(null);
    this.showModal.set(true);
  }

  openEditModal(task: Task): void {
    this.editingTask.set(task);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingTask.set(null);
  }

  onSaveTask(taskData: Omit<Task, 'id' | 'createdAt'>): void {
    if (this.editingTask()) {
      this.taskService.updateTask(this.editingTask()!.id, taskData);
    } else {
      this.taskService.addTask(taskData);
    }
    this.loadTasks();
  }

  onDeleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId);
    this.loadTasks();
  }

  onMoveTask(event: { taskId: string; newStatus: TaskStatus }): void {
    this.taskService.moveTask(event.taskId, event.newStatus);
    this.loadTasks();
  }
}