import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/canteendashboard']); // Redirect if already logged in
    }
  }

  async onLogin() {
    try {
      const success = await this.authService.login(this.username);
      if (success) {
        this.router.navigate(['/canteendashboard']);
      } else {
        this.errorMessage = 'Login failed. User not found.';
      }
    } catch (error) {
      this.errorMessage = error.message || 'An unexpected error occurred.';
    }
  }
}
