import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  constructor(private taskService: TaskService) {}

  get proximityColor(): string {
    return this.taskService.getProximityColor(this.task.due);
  }

  get levelLabel(): string {
    return this.taskService.getLevelLabel(this.task.level);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.task.id);
  }

  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.task.id);
    (event.target as HTMLElement).classList.add('opacity-70');
  }

  onDragEnd(event: DragEvent): void {
    (event.target as HTMLElement).classList.remove('opacity-70');
  }
}