import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css']
})
export class TaskColumnComponent {
  @Input() status!: TaskStatus;
  @Input() title!: string;
  @Input() tasks: Task[] = [];
  
  @Output() taskEdit = new EventEmitter<Task>();
  @Output() taskDelete = new EventEmitter<string>();
  @Output() taskMove = new EventEmitter<{taskId: string, newStatus: TaskStatus}>();

  get columnTitle(): string {
    const titles: Record<TaskStatus, string> = {
      'todo': 'Para fazer',
      'doing': 'Em andamento', 
      'done': 'Concluídas'
    };
    return titles[this.status];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.taskMove.emit({ taskId, newStatus: this.status });
    }
  }

  onTaskEdit(task: Task): void {
    this.taskEdit.emit(task);
  }

  onTaskDelete(taskId: string): void {
    this.taskDelete.emit(taskId);
  }
}