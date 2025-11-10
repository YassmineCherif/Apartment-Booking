import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/Services/Reservation/reservation.service';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';
import { Reservation } from 'src/app/models/Reservation';
import { Pays } from 'src/app/models/Pays';
import { Residence } from 'src/app/models/Residence';
import { Bloc } from 'src/app/models/bloc';
import { Appartement } from 'src/app/models/appartement';

@Component({
  selector: 'app-respond-reservation',
  templateUrl: './respond-reservation.component.html',
  styleUrls: ['./respond-reservation.component.css']
})
export class RespondReservationComponent implements OnInit {

  paysList: Pays[] = [];
  residencesList: Residence[] = [];
  blocsList: Bloc[] = [];

  selectedPaysId?: number;
  selectedResidenceId?: number;
  selectedBlocId?: number;
  appartementsList: Appartement[] = [];
  selectedAppartementId?: number;

  reservations: Reservation[] = [];
  allReservations: Reservation[] = [];

  constructor(
    private reservationService: ReservationService,
    private appartementService: AppartementService
  ) {}

  ngOnInit(): void {
    this.loadPays();
    this.loadAllReservations();
  }

  // ---------- Utility: normalize strings ----------
  private normalize(val?: string | null): string {
    return (val ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove accents
  }

  // ================== LOAD COUNTRIES ==================
  loadPays(): void {
    this.appartementService.getAllPays().subscribe(data => {
      this.paysList = data;
      console.log('[Pays] loaded:', this.paysList);
    });
  }

  // ================== HANDLE COUNTRY CHANGE ==================
onPaysChange(): void {
  if (this.selectedPaysId == null) {
    // Default option selected -> show all reservations
    this.reservations = [...this.allReservations];
    console.log('[onPaysChange] default selected -> showing all reservations', this.reservations.length);
    return;
  }

  const selectedPays = this.paysList.find(p => p.id_country === this.selectedPaysId)?.pays;
  console.log('[onPaysChange] selectedPaysId:', this.selectedPaysId, 'selectedPays:', selectedPays);

  this.reservations = this.allReservations.filter(
    r => r.paysNom?.trim().toLowerCase() === selectedPays?.trim().toLowerCase()
  );

  console.log('[onPaysChange] filtered reservations count:', this.reservations.length);
}


  // ================== LOAD RESERVATIONS ==================
  loadAllReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: data => {
        this.allReservations = data;
        console.log('[Reservations] loaded:', this.allReservations);
        this.enrichReservations(this.allReservations); // fill bloc/residence/pays names
        this.reservations = [...this.allReservations]; // initially show all
      },
      error: () => console.error('Error loading reservations ❌')
    });
  }

  // ================== ENRICH RESERVATIONS ==================
  enrichReservations(resList: Reservation[]): void {
    resList.forEach(r => {
      if (r.appartements?.id_bloc) {
        this.appartementService.getBlocById(r.appartements.id_bloc).subscribe(bloc => {
          r.blocNom = bloc.nom;
          if (bloc.id_residence) {
            this.appartementService.getResidenceById(bloc.id_residence).subscribe(res => {
              r.residenceNom = res.nom;
              if (res.id_pays) {
                this.appartementService.getPaysById(res.id_pays).subscribe(p => {
                  r.paysNom = p.pays;
                  console.log(`Reservation #${r.id_reservation} paysNom =`, r.paysNom);

                  // Re-apply country filter if already selected
                  if (this.selectedPaysId) this.onPaysChange();
                });
              }
            });
          }
        });
      }
    });
  }

  // ================== FILTER (Bloc/Residence/Pays) ==================
  filterReservations(): void {
    let filtered = [...this.allReservations];

    if (this.selectedBlocId) {
      filtered = filtered.filter(r => r.appartements?.id_bloc === this.selectedBlocId);
    }

    if (this.selectedResidenceId) {
      const selectedRes = this.residencesList.find(res => res.id_residence === this.selectedResidenceId)?.nom;
      filtered = filtered.filter(r => r.residenceNom === selectedRes);
    }

    if (this.selectedPaysId) {
      const selectedPays = this.paysList.find(p => p.id_country === this.selectedPaysId)?.pays;
      filtered = filtered.filter(r => this.normalize(r.paysNom) === this.normalize(selectedPays ?? ''));
    }

    this.reservations = filtered;
    console.log('[filterReservations] result count:', this.reservations.length);
  }

  // ================== RESPOND TO RESERVATION ==================
  acceptReservation(reservation: Reservation): void {
    this.updateApproval(reservation, 1);
  }

  declineReservation(reservation: Reservation): void {
    this.updateApproval(reservation, 0);
  }

  updateApproval(reservation: Reservation, status: number): void {
    this.reservationService.updateReservationApproval(reservation.id_reservation!, status).subscribe({
      next: () => reservation.approved = status,
      error: () => console.error('Error updating reservation ❌')
    });
  }

  // ================== RESIDENCE / BLOC CHANGE ==================
  onResidenceChange(): void {
    if (!this.selectedResidenceId) {
      this.blocsList = [];
      this.filterReservations();
      return;
    }
    this.appartementService.getBlocsByResidence(this.selectedResidenceId).subscribe(data => {
      this.blocsList = data;
      this.selectedBlocId = undefined;
      this.filterReservations();
    });
  }

  onBlocChange(): void {
    this.filterReservations();
  }
}
