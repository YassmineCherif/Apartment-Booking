import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  CONCIERGE = 'CONCIERGE'
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUserRole: USER_ROLE | null = null;
  userRole = USER_ROLE; // For use in template

  constructor(private router: Router) {}

  ngOnInit(): void {
    const role = sessionStorage.getItem('role');
    if (role) {
      this.currentUserRole = role as USER_ROLE;
      console.log('AdminComponent role:', this.currentUserRole);
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
