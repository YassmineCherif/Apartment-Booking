import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/Services/Reclamation/reclamation.service';
import { Reclamation } from 'src/app/models/Reclamation';
import { ETAT_RECLAMATION } from 'src/app/models/ETAT_RECLAMATION';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {

  currentUser: User | null = null;
  reclamations: Reclamation[] = [];
  newReclamation: Reclamation = { titre: '', description: '', localisation: '' };
  ETAT = ETAT_RECLAMATION;

  // Control modal visibility
  showForm: boolean = false;

  constructor(
    private reclamationService: ReclamationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const login = sessionStorage.getItem('login');
    if (login) {
      this.userService.getUserProfileByLogin(login).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loadReclamations();
        },
        error: (err) => console.error('Failed to load user:', err)
      });
    }
  }

  loadReclamations() {
    if (!this.currentUser) return;
    this.reclamationService.getUserReclamations(this.currentUser.id_user!).subscribe({
      next: (res) => this.reclamations = res,
      error: (err) => console.error(err)
    });
  }

  addReclamation() {
    if (!this.currentUser) return;
    if (!this.newReclamation.titre || !this.newReclamation.description) return;

    this.reclamationService.addReclamation(this.currentUser.id_user!, this.newReclamation).subscribe({
      next: (res) => {
        this.reclamations.push(res);
        this.newReclamation = { titre: '', description: '', localisation: '' };
        this.showForm = false; // close modal
      },
      error: (err) => console.error(err)
    });
  }

  deleteReclamation(id: number) {
    this.reclamationService.deleteReclamation(id).subscribe({
      next: () => this.reclamations = this.reclamations.filter(r => r.id_reclamation !== id),
      error: (err) => console.error(err)
    });
  }

  updateStatus(id: number, status: ETAT_RECLAMATION) {
    this.reclamationService.updateStatus(id, status).subscribe({
      next: (res) => {
        const idx = this.reclamations.findIndex(r => r.id_reclamation === id);
        if (idx > -1) this.reclamations[idx].etatReclamation = status;
      },
      error: (err) => console.error(err)
    });
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
