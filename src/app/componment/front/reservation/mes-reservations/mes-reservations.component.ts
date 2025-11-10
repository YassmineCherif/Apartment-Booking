import { Component, OnInit } from '@angular/core';
import { ReservationService } from 'src/app/Services/Reservation/reservation.service';
import { AppartementService } from 'src/app/Services/appartement/appartement.service';
import { Reservation } from 'src/app/models/Reservation';

@Component({
  selector: 'app-mes-reservations',
  templateUrl: './mes-reservations.component.html',
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  staticUserId = 1; 
  constructor(private reservationService: ReservationService,
    private appartementService: AppartementService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

loadReservations(): void {
  this.reservationService.getReservationsByUser(this.staticUserId).subscribe({
    next: data => {
      this.reservations = data;
      this.enrichReservations();   
    },
    error: () => console.error("Erreur lors du chargement des réservations ❌")
  });
}



    enrichReservations(): void {
    this.reservations.forEach(r => {
      if (r.appartements?.id_bloc) {
        this.appartementService.getBlocById(r.appartements.id_bloc).subscribe(bloc => {
          r.blocNom = bloc.nom;

          if (bloc.id_residence) {
            this.appartementService.getResidenceById(bloc.id_residence).subscribe(residence => {
              r.residenceNom = residence.nom;

              if (residence.id_pays) {
                this.appartementService.getPaysById(residence.id_pays).subscribe(pays => {
                  r.paysNom = pays.pays;
                });
              }
            });
          }
        });
      }
    });
  }


}
