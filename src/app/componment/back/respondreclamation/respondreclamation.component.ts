import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/Services/Reclamation/reclamation.service';
import { Reclamation } from 'src/app/models/Reclamation';
import { ETAT_RECLAMATION } from 'src/app/models/ETAT_RECLAMATION';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-respondreclamation',
  templateUrl: './respondreclamation.component.html',
  styleUrls: ['./respondreclamation.component.css']
})
export class RespondreclamationComponent implements OnInit {

  currentUser: User | null = null;
  reclamations: Reclamation[] = [];
  allUsers: User[] = [];
  ETAT = ETAT_RECLAMATION;

 

  constructor(
    private reclamationService: ReclamationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Load logged-in user
    const login = sessionStorage.getItem('login');
    if (login) {
      this.userService.getUserProfileByLogin(login).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loadReclamations();
          this.loadAllUsers();
        },
        error: (err) => console.error('Failed to load user:', err)
      });
    }
  }

  // Load all users to map user names
  loadAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: users => this.allUsers = users,
      error: err => console.error('Failed to load users', err)
    });
  }

  // Load all reclamations
  loadReclamations() {
    if (!this.currentUser) return;
    this.reclamationService.getAll().subscribe({
      next: res => this.reclamations = res,
      error: err => console.error(err)
    });
  }

  // Approve or Reject
  updateStatus(id: number, status: ETAT_RECLAMATION) {
    this.reclamationService.updateStatus(id, status).subscribe({
      next: (res) => {
        const idx = this.reclamations.findIndex(r => r.id_reclamation === id);
        if (idx > -1) this.reclamations[idx].etatReclamation = status;
      },
      error: (err) => console.error(err)
    });
  }

  // Get the full name of the user who submitted the reclamation
getUserName(rec: Reclamation): string {
  if (!rec.user) return 'Utilisateur inconnu';
  return `${rec.user.nom} ${rec.user.prenom}`;
}


  // Convert enum to French label
  getEtatLabel(etat: ETAT_RECLAMATION): string {
    switch (etat) {
      case ETAT_RECLAMATION.APPROUVE: return 'Approuvé';
      case ETAT_RECLAMATION.REJETE: return 'Rejeté';
      case ETAT_RECLAMATION.EN_ATTENTE: return 'En attente';
      default: return '';
    }
  }
}
