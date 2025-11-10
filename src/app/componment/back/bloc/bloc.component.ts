import { Component, OnInit } from '@angular/core';
import { Bloc } from 'src/app/models/bloc';
import { Pays } from 'src/app/models/Pays';
import { Residence } from 'src/app/models/Residence';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';

declare var bootstrap: any;

@Component({
  selector: 'app-bloc',
  templateUrl: './bloc.component.html',
  styleUrls: ['./bloc.component.css']
})
export class BlocComponent implements OnInit {
  blocToUpdate: Bloc | null = null;
  blocs: Bloc[] = [];
  filteredBlocs: Bloc[] = [];
  searchTerm: string = '';
  toasts: { message: string, type: 'success' | 'error' }[] = [];

  paysList: Pays[] = [];
  selectedPaysId?: number = undefined;

  residencesList: Residence[] = [];
  selectedResidenceId?: number = undefined; 

  allResidences: Residence[] = [];
   
  constructor(private service: AppartementService) {}

  ngOnInit(): void {
     this.fetchPays(); 
     this.fetchAllBlocs();
       this.fetchAllResidences(); 
  }


  fetchAllBlocs(): void {
  this.service.getAllBlocs().subscribe({
    next: data => {
      this.blocs = data.sort((a, b) => (b.id_bloc ?? 0) - (a.id_bloc ?? 0));
      this.filteredBlocs = [...this.blocs]; // show all by default
    },
    error: () => this.showToast('Failed to load blocs ❌', 'error')
  });
}


fetchAllResidences(): void {
  this.service.getAllResidences().subscribe({
    next: data => this.allResidences = data,
    error: () => this.showToast('Failed to load residences ❌', 'error')
  });
}



  // ==================== FETCH PAY ====================
  fetchPays(): void {
    this.service.getAllPays().subscribe({
      next: data => this.paysList = data.sort((a, b) => a.pays.localeCompare(b.pays)),
      error: () => this.showToast('Failed to load pays ❌', 'error')
    });
  }

  // ==================== PAY CHANGE ====================
onPaysChange(): void {
  if (!this.selectedPaysId) {
    // Show ALL blocs when no pays is selected
    this.filteredBlocs = [...this.blocs];
    this.residencesList = this.allResidences; // ✅ keep all residences available
    this.selectedResidenceId = undefined;
    return;
  }

  this.service.getResidencesByPays(this.selectedPaysId).subscribe({
    next: data => {
      this.residencesList = data.sort((a, b) => a.nom.localeCompare(b.nom));
      const residenceIds = this.residencesList.map(r => r.id_residence);
      this.filteredBlocs = this.blocs.filter(
        b => b.id_residence && residenceIds.includes(b.id_residence)
      );
      this.selectedResidenceId = undefined;
    },
    error: () => this.showToast('Failed to load residences for selected Pays ❌', 'error')
  });
}


  // ==================== RESIDENCE CHANGE ====================
  onResidenceChange(): void {
    if (!this.selectedResidenceId) {
      this.filteredBlocs = [];
      return;
    }

    this.service.getBlocsByResidence(this.selectedResidenceId).subscribe({
      next: data => this.filteredBlocs = data.sort((a, b) => (b.id_bloc ?? 0) - (a.id_bloc ?? 0)),
      error: () => this.showToast('Failed to load blocs for selected Residence ❌', 'error')
    });
  }

  // ==================== OTHER FUNCTIONS ====================
getResidenceName(id?: number): string {
  const res = this.allResidences.find(r => r.id_residence === id);
  return res ? res.nom : 'N/A';
}


  filterBlocs(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredBlocs = this.filteredBlocs.filter(b => b.nom.toLowerCase().includes(term));
  }

  deleteBloc(id?: number) {
    if (!id) return;
    this.service.deleteBloc(id).subscribe({
      next: () => this.onResidenceChange(),
      error: () => this.showToast('Failed to delete bloc ❌', 'error')
    });
  }

  openEditModal(bloc: Bloc) {
    this.blocToUpdate = { ...bloc };
    const modal = new bootstrap.Modal(document.getElementById('blocModal')!);
    modal.show();
  }

  openCreateModal() {
    this.blocToUpdate = { id_bloc: undefined, nom: '', nombreEtages: 0, id_residence: this.selectedResidenceId  };
    const modal = new bootstrap.Modal(document.getElementById('blocModal')!);
    modal.show();
  }

  closeModal() {
    const modalEl = document.getElementById('blocModal');
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  saveBloc(): void {
    if (!this.blocToUpdate || !this.blocToUpdate.id_residence) {
      this.showToast('Please select a residence ❌', 'error');
      return;
    }

    const refreshData = () => {
      this.onResidenceChange(); // refresh blocs for the selected residence
      this.blocToUpdate = null;
      this.closeModal();
    };

    if (this.blocToUpdate.id_bloc) {
      this.service.updateBloc(this.blocToUpdate).subscribe({
        next: () => { refreshData(); this.showToast('Bloc updated successfully ✅', 'success'); },
        error: () => this.showToast('Failed to update bloc ❌', 'error')
      });
    } else {
      this.service.addBloc(this.blocToUpdate).subscribe({
        next: () => { refreshData(); this.showToast('Bloc created successfully ✅', 'success'); },
        error: () => this.showToast('Failed to create bloc ❌', 'error')
      });
    }
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
