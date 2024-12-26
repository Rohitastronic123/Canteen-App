import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rso-canteen-app';
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    // Automatically redirect if the user is logged in
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.router.navigate(['/canteen']); // Redirect to canteen page if logged in
      } else {
        this.router.navigate(['/login']); // Redirect to login if not authenticated
      }
    });
  }
}
