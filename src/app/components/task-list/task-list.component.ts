import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatIconModule, MatButtonModule, ConfirmDialogComponent, MatFormFieldModule, MatInputModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  providers: []
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = []; 
  displayedColumns: string[] = ['title', 'description', 'dueDate', 'isCompleted', 'actions'];
  loading: boolean = false;

  constructor(private taskService: TaskService, public dialog: MatDialog, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getTasks();
  }

  getTasks(): void {
    this.loading = true;
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        this.filteredTasks = data;  
        this.loading = false;
        console.log('Tasks successfully retrieved');
      },
      error => {
        console.error('Error retrieving tasks', error);
        this.loading = false;
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(filterValue) || 
      task.description.toLowerCase().includes(filterValue)
    );
  }

  deleteTask(taskId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.taskService.deleteTask(taskId).subscribe(() => {
          console.log('Task successfully deleted');
          this.tasks = this.tasks.filter(task => task.taskId !== taskId);
          this.filteredTasks = this.filteredTasks.filter(task => task.taskId !== taskId);
        });
      }
    });
  }

  logout() {
    this.authService.logout();  
    this.router.navigate(['/login']);
  }
}
