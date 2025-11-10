import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'internships';
  constructor(private router: Router) {}

  get isAdmin(): boolean {
    return (sessionStorage.getItem('role') || '').toUpperCase() === 'ADMIN';
  }

  get isAdminRoute(): boolean {
    const url = this.router.url || '';
    return url.startsWith('/admin');
  }

  get isAuthPage(): boolean {
    const url = this.router.url || '';
  return url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/forgot');
  }
}
