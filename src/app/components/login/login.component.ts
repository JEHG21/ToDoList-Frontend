import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {  
  username: string = ''; 
  password: string = '';
  errorMessage: string = '';  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/tasks']); 
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      data => {
        this.router.navigate(['/tasks']);
      },
      error => {
        this.errorMessage = 'Invalid login credentials';
      }
    );
  }
}
