import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input'; 
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

import flatpickr from 'flatpickr';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTableModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatCheckboxModule,],  
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {  
  task: Task = {
    taskId: 0,
    title: '',
    description: '',
    dueDate: '',
    isCompleted: false,
  };

  isEditMode = false;

  constructor(
    private taskService: TaskService, 
    private router: Router,
    private route: ActivatedRoute  
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');  
    if (id) {
      this.isEditMode = true;  
      this.getTaskById(+id); 
    } else {
      this.initializeFlatpickr();
    }
  }    

  getTaskById(id: number): void {
    this.taskService.getTask(id).subscribe(
      (task) => {
        if (task.dueDate) {
          const date = new Date(task.dueDate);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          this.task.dueDate = `${year}-${month}-${day}`;
        }
        
        this.task.taskId = task.taskId;
        this.task.title = task.title;
        this.task.description = task.description;
        this.task.isCompleted = task.isCompleted;

        this.initializeFlatpickr();
      },
      (error) => {
        console.error('Error retrieving task:', error);
      }
    );
  }

  initializeFlatpickr(): void {
    flatpickr('#dueDateInput', {
      dateFormat: 'Y-m-d',
      defaultDate: this.task.dueDate, 
      onChange: (selectedDates, dateStr) => {
        this.task.dueDate = dateStr;
      },
    });
  }
  
  onSubmit(): void {
    if (this.isEditMode) {
      this.updateTask();  
    } else {
      this.createTask();  
    }
  }

  //CreateTask
  createTask(): void {
    this.taskService.createTask(this.task).subscribe(() => {
      console.log('Task successfully added');
      this.router.navigate(['/']);  
    });
  }

  //UpdateTask
  updateTask(): void {
    this.taskService.updateTask(this.task.taskId, this.task).subscribe(() => {
      console.log('Task successfully updated');
      this.router.navigate(['/']);  
    });
  }
}
