import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],  
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
      },
      (error) => {
        console.error('Error retrieving task:', error);
      }
    );
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
