import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  providers: []
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading: boolean = false;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        this.loading = false;
        console.log('Tasks successfully retrieved');
      },
      error => {
        console.error('Error retrieving tasks', error);
        this.loading = false;
      }
    );
  }

  deleteTask(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      this.taskService.deleteTask(id).subscribe(() => {
        console.log('Task successfully deleted');
        this.tasks = this.tasks.filter(task => task.taskId !== id);
      }, error => {
        console.error('Error deleting task:', error);
      });
    }
  }
}
