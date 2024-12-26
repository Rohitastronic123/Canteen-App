import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'username';

  constructor(private firestore: AngularFirestore, public router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  async login(username: string): Promise<boolean> {
    try {
      const snapshot = await this.firestore
        .collection('users', ref => ref.where('username', '==', username))
        .get()
        .toPromise();

      if (snapshot.empty) {
        throw new Error('User not found');
      }

      localStorage.setItem(this.SESSION_KEY, username);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  getSessionUsername(): string | null {
    return localStorage.getItem(this.SESSION_KEY);
  }
}
