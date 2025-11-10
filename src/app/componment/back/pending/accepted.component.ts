import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/Services/user/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-accepted',
  templateUrl: './accepted.component.html',
    styleUrls: ['./accepted.component.css']

})
export class PendingComponent implements OnInit {
  pending: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }


  
  loadPendingUsers(): void {
  this.loading = true;
  this.error = null;

  this.userService.getPendingUsers().subscribe({
    next: (users) => {
      // Keep only pending users (approved === 2)
      this.pending = users.filter(u => u.approved === 2);
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to load users';
      this.loading = false;
    },
  });
}





setApproval(id: number | undefined, approved: boolean): void {
  if (!id) return;

  const approvedValue = approved ? 1 : 0; // 1 = approved, 0 = declined

  this.userService.setApproval(id, approvedValue).subscribe({
    next: () => this.loadPendingUsers(), // reload list
    error: () => (this.error = 'Failed to update user'),
  });
}




}
