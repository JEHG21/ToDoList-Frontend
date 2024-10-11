import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, 
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'add-task', component: TaskFormComponent, canActivate: [AuthGuard] }, 
    { path: 'task/:id', component: TaskDetailsComponent, canActivate: [AuthGuard] }, 
    { path: 'edit-task/:id', component: TaskFormComponent, canActivate: [AuthGuard] },
    { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent }
];