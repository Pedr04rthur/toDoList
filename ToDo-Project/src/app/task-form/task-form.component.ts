import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',  // ← CORRIGIDO: .component.html
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnChanges {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Task, 'id' | 'createdAt'>>();
  
  @Input() editingTask: Task | null = null;

  title = '';
  due = '';
  level: 'low' | 'medium' | 'high' = 'medium';
  desc = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingTask'] && this.editingTask) {
      this.title = this.editingTask.title;
      this.due = this.editingTask.due;
      this.level = this.editingTask.level;
      this.desc = this.editingTask.desc;
    }
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.due) return;

    const taskData: Omit<Task, 'id' | 'createdAt'> = {
      title: this.title.trim(),
      due: this.due,
      level: this.level,
      desc: this.desc.trim(),
      status: 'todo'
    };

    this.save.emit(taskData);
    this.resetForm();
    this.close.emit();
  }

  onCancel(): void {
    this.resetForm();
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.onCancel();
    }
  }

  private resetForm(): void {
    this.title = '';
    this.due = '';
    this.level = 'medium';
    this.desc = '';
  }
}