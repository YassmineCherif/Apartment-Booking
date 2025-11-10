import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
   constructor(private router: Router) {}

  logout() {
    // Example: Clear token and redirect
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}
