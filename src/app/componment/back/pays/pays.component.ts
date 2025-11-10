import { Component, OnInit } from '@angular/core';
import { Pays } from 'src/app/models/Pays';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';

declare var bootstrap: any;

@Component({
  selector: 'app-pays',
  templateUrl: './pays.component.html',
  styleUrls: ['./pays.component.css']
})
export class PaysComponent implements OnInit {
  paysToUpdate: Pays | null = null;
  paysList: Pays[] = [];
  filteredPays: Pays[] = [];
  searchTerm: string = '';
  toasts: { message: string, type: 'success' | 'error' }[] = [];

  constructor(private service: AppartementService) {}

  ngOnInit(): void {
    this.fetchPays();
  }

  fetchPays(): void {
    this.service.getAllPays().subscribe({
      next: data => {
        this.paysList = data.sort((a, b) => (b.id_country ?? 0) - (a.id_country ?? 0));
        this.filteredPays = this.paysList;
      },
      error: () => this.showToast('Failed to load countries ❌', 'error')
    });
  }

  filterPays(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPays = this.paysList.filter(p => p.pays.toLowerCase().includes(term));
  }

  deletePays(id?: number) {
    if (!id) return;
    this.service.deletePays(id).subscribe({
      next: () => { this.fetchPays(); this.showToast('Pays deleted successfully ✅', 'success'); },
      error: () => this.showToast('Failed to delete pays ❌', 'error')
    });
  }

  savePays(): void {
    if (!this.paysToUpdate) return;

    if (this.paysToUpdate.id_country) {
      // Update
      this.service.updatePays(this.paysToUpdate).subscribe({
        next: () => { this.fetchPays(); this.closeModal(); this.showToast('Pays updated successfully ✅', 'success'); },
        error: () => this.showToast('Failed to update pays ❌', 'error')
      });
    } else {
      // Create
      this.service.addPays(this.paysToUpdate).subscribe({
        next: () => { this.fetchPays(); this.closeModal(); this.showToast('Pays created successfully ✅', 'success'); },
        error: () => this.showToast('Failed to create pays ❌', 'error')
      });
    }
  }

  openEditModal(pays: Pays) {
    this.paysToUpdate = { ...pays };
    const modal = new bootstrap.Modal(document.getElementById('paysModal')!);
    modal.show();
  }

  openCreateModal() {
    this.paysToUpdate = { id_country: undefined, pays: '', localisation: '', adress: '', ville: '' };
    const modal = new bootstrap.Modal(document.getElementById('paysModal')!);
    modal.show();
  }

  closeModal() {
    const modalEl = document.getElementById('paysModal');
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
