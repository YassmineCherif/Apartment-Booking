import { Component, OnInit } from '@angular/core';
import { Appartement } from 'src/app/models/appartement';
import { Bloc } from 'src/app/models/bloc';
import { Pays } from 'src/app/models/Pays';
import { Residence } from 'src/app/models/Residence';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';

declare var bootstrap: any;

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  appartementToUpdate: Appartement | null = null;
  appartementsList: Appartement[] = [];
  blocsList: Bloc[] = [];
  residencesList: Residence[] = [];
  paysList: Pays[] = [];

  selectedPaysId?: number;
  selectedResidenceId?: number;
  selectedBlocId?: number;

  filteredResidences: Residence[] = [];
  filteredBlocs: Bloc[] = [];
  filteredAppartements: Appartement[] = [];

  searchTerm: string = '';
  selectedFile?: File;
  toasts: { message: string, type: 'success' | 'error' }[] = [];

  constructor(private service: AppartementService) {}

  ngOnInit(): void {
    this.fetchPays();
    this.fetchResidences();
    this.fetchBlocs();
    this.fetchAppartements();
  }

  // ================== FETCH ==================
  fetchPays(): void {
    this.service.getAllPays().subscribe({
      next: data => this.paysList = data.sort((a, b) => a.pays.localeCompare(b.pays)),
      error: () => this.showToast('Failed to load pays ❌', 'error')
    });
  }

  fetchResidences(): void {
    this.service.getAllResidences().subscribe({
      next: data => this.residencesList = data.sort((a, b) => a.nom.localeCompare(b.nom)),
      error: () => this.showToast('Failed to load residences ❌', 'error')
    });
  }

  fetchBlocs(): void {
    this.service.getAllBlocs().subscribe({
      next: data => this.blocsList = data.sort((a, b) => a.nom.localeCompare(b.nom)),
      error: () => this.showToast('Failed to load blocs ❌', 'error')
    });
  }

  fetchAppartements(): void {
    this.service.getAllAppartements().subscribe({
      next: data => {
        this.appartementsList = data.sort((a, b) => (b.id_app ?? 0) - (a.id_app ?? 0));
        this.filteredAppartements = [...this.appartementsList];
      },
      error: () => this.showToast('Failed to load appartements ❌', 'error')
    });
  }

  // ================== FILTER LOGIC ==================
  onPaysChange(): void {
    this.selectedResidenceId = undefined;
    this.selectedBlocId = undefined;
    this.filteredAppartements = [];

    if (!this.selectedPaysId) {
      this.filteredResidences = [];
      this.filteredBlocs = [];
      this.filteredAppartements = [...this.appartementsList];
      return;
    }

    // Filter residences for selected pays
    this.filteredResidences = this.residencesList.filter(r => r.id_pays === this.selectedPaysId);

    // Filter blocs for filtered residences
    const residenceIds = this.filteredResidences.map(r => r.id_residence);
    this.filteredBlocs = this.blocsList.filter(b => residenceIds.includes(b.id_residence));

    // Filter appartements for these blocs
    const blocIds = this.filteredBlocs.map(b => b.id_bloc);
    this.filteredAppartements = this.appartementsList.filter(app => blocIds.includes(app.id_bloc));
  }

  onResidenceChange(): void {
    this.selectedBlocId = undefined;
    this.filteredAppartements = [];

    if (!this.selectedResidenceId) {
      // Show appartements for selected pays
      const blocIds = this.filteredBlocs.map(b => b.id_bloc);
      this.filteredAppartements = this.appartementsList.filter(app => blocIds.includes(app.id_bloc));
      return;
    }

    // Filter blocs for this residence
    this.filteredBlocs = this.blocsList.filter(b => b.id_residence === this.selectedResidenceId);

    const blocIds = this.filteredBlocs.map(b => b.id_bloc);
    this.filteredAppartements = this.appartementsList.filter(app => blocIds.includes(app.id_bloc));
  }

  onBlocChange(): void {
    if (!this.selectedBlocId) {
      // Show appartements for selected residence
      const blocIds = this.filteredBlocs.map(b => b.id_bloc);
      this.filteredAppartements = this.appartementsList.filter(app => blocIds.includes(app.id_bloc));
      return;
    }

    // Filter appartements for selected bloc
    this.filteredAppartements = this.appartementsList.filter(app => app.id_bloc === this.selectedBlocId);
  }

  filterAppartements(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredAppartements = this.filteredAppartements.filter(app =>
      app.titre.toLowerCase().includes(term) ||
      (app.description?.toLowerCase().includes(term) ?? false)
    );
  }

  getBlocName(id?: number): string {
    const bloc = this.blocsList.find(b => b.id_bloc === id);
    return bloc ? bloc.nom : 'N/A';
  }

  // ================== MODALS ==================
  openCreateModal() {
    this.appartementToUpdate = {
      id_app: undefined,
      titre: '',
      description: '',
      id_bloc: this.selectedBlocId,
      image: ''
    };
    this.selectedFile = undefined;
    new bootstrap.Modal(document.getElementById('appartementModal')!).show();
  }

  openEditModal(app: Appartement) {
    this.appartementToUpdate = { ...app };
    new bootstrap.Modal(document.getElementById('appartementModal')!).show();
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (this.appartementToUpdate) {
        this.appartementToUpdate.image = 'images/' + file.name;
      }
    }
  }

  saveAppartement(): void {
    if (!this.appartementToUpdate || !this.appartementToUpdate.id_bloc) {
      this.showToast('Please select a bloc ❌', 'error');
      return;
    }
    if (!this.selectedFile) {
      this.showToast('Please select an image ❌', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('titre', this.appartementToUpdate.titre!);
    formData.append('description', this.appartementToUpdate.description!);
    formData.append('id_bloc', this.appartementToUpdate.id_bloc!.toString());

    this.service.addAppartementWithImage(formData).subscribe({
      next: () => {
        this.fetchAppartements();
        this.appartementToUpdate = null;
        this.selectedFile = undefined;
        this.showToast('Appartement created ✅', 'success');
        this.closeModal();
      },
      error: () => this.showToast('Failed to create appartement ❌', 'error')
    });
  }

  supprimerAppartement(id_app?: number): void {
    if (!id_app) return;
    this.service.deleteAppartement(id_app).subscribe({
      next: () => { this.fetchAppartements(); this.showToast('Appartement deleted ✅', 'success'); },
      error: () => this.showToast('Failed to delete appartement ❌', 'error')
    });
  }

  closeModal() {
    const modalEl = document.getElementById('appartementModal');
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
