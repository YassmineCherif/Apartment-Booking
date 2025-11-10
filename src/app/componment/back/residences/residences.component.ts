import { Component, OnInit } from '@angular/core';
import { Pays } from 'src/app/models/Pays';
import { Residence } from 'src/app/models/Residence';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';

declare var bootstrap: any;

@Component({
  selector: 'app-residences',
  templateUrl: './residences.component.html',
  styleUrls: ['./residences.component.css']
})
export class ResidencesComponent implements OnInit {
  residenceToUpdate: Residence | null = null;
  residences: Residence[] = [];
  filteredResidences: Residence[] = [];
  searchTerm: string = '';
  toasts: { message: string, type: 'success' | 'error' }[] = [];

  paysList: Pays[] = [];
  selectedPaysId?: number = undefined; 


  constructor(private service: AppartementService) {}

  ngOnInit(): void {
    this.fetchPays();
    this.fetchResidences();
  }


 
fetchPays(): void {
  this.service.getAllPays().subscribe({
    next: data => this.paysList = data,
    error: () => this.showToast('Failed to load pays ❌', 'error')
  });
}



onPaysChange(): void {
  if (this.selectedPaysId) {
    this.service.getResidencesByPays(this.selectedPaysId).subscribe({
      next: data => this.filteredResidences = data,
      error: () => this.showToast('Failed to load residences for this pays ❌', 'error')
    });
  } else {
    this.filteredResidences = this.residences;
  }
}


getPaysName(id?: number): string {
  const pays = this.paysList.find(p => p.id_country === id);
  return pays ? pays.pays : 'N/A';
}



  fetchResidences(): void {
    this.service.getAllResidences().subscribe({
      next: data => {
        this.residences = data.sort((a, b) => (b.id_residence ?? 0) - (a.id_residence ?? 0));
        this.filteredResidences = this.residences;
      },
      error: () => this.showToast('Failed to load residences ❌', 'error')
    });
  }

  filterResidences(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredResidences = this.residences.filter(r => r.nom.toLowerCase().includes(term));
  }

  deleteResidence(id?: number) {
    if (!id) return;
    this.service.deleteResidence(id).subscribe({
      next: () => { this.fetchResidences(); this.showToast('Residence deleted successfully ✅', 'success'); },
      error: () => this.showToast('Failed to delete residence ❌', 'error')
    });
  }


  
  saveResidence(): void {
  if (!this.residenceToUpdate) return;

  const refreshData = () => {
    this.fetchPays();        // refresh pays list
    this.fetchResidences();  // refresh residences list
    this.selectedPaysId = undefined; // reset select to null
    this.filteredResidences = this.residences; // show all residences
    this.closeModal();
  };

  if (this.residenceToUpdate.id_residence) {
    // Update
    this.service.updateResidence(this.residenceToUpdate).subscribe({
      next: () => { 
        refreshData(); 
        this.showToast('Residence updated successfully ✅', 'success'); 
      },
      error: () => this.showToast('Failed to update residence ❌', 'error')
    });
  } else {
    // Create
    this.service.addResidence(this.residenceToUpdate).subscribe({
      next: () => { 
        refreshData(); 
        this.showToast('Residence created successfully ✅', 'success'); 
      },
      error: () => this.showToast('Failed to create residence ❌', 'error')
    });
  }
}



refreshData() {
  this.fetchPays();
  this.fetchResidences();
  if (this.residenceToUpdate?.id_pays) {
    this.selectedPaysId = this.residenceToUpdate.id_pays;
    this.onPaysChange(); // refresh filteredResidences for this pays
  } else {
    this.selectedPaysId = undefined;
  }
  this.closeModal();
}



  openEditModal(residence: Residence) {
    this.residenceToUpdate = { ...residence };
    const modal = new bootstrap.Modal(document.getElementById('residenceModal')!);
    modal.show();
  }


  
  openCreateModal() {
  this.residenceToUpdate = { 
    id_residence: undefined, 
    nom: '', 
    nombrebloc: 0, 
    blocs: [],
    id_pays: this.selectedPaysId // default to selected pays
  };
  const modal = new bootstrap.Modal(document.getElementById('residenceModal')!);
  modal.show();
}




  closeModal() {
    const modalEl = document.getElementById('residenceModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  showToast(message: string, type: 'success' | 'error') {
    const toast = { message, type };
    this.toasts.push(toast);
    setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      if (index >= 0) this.toasts.splice(index, 1);
    }, 3000);
  }
}
