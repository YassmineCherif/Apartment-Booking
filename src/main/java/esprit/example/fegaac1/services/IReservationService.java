package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;

public interface IReservationService {


    public List<Pays> getAllPays() ;

    // Get residences of a specific country
    public Set<Residence> getResidencesByPays(Long paysId);

    // Get blocs of a specific residence
    public Set<Bloc> getBlocsByResidence(Long residenceId);

    // Get appartements of a specific bloc
    public Set<Appartement> getAppartementsByBloc(Long blocId) ;

    public Reservation createReservation(Long appartementId, LocalDate start, LocalDate end);


    public Reservation reserverAppartement(Long appartementId, Long userId, LocalDate dateDebut, LocalDate dateFin);

    public boolean existsByUserAndAppartement(Long userId, Long appartementId);

    public List<Reservation> getReservationsByUser(Long userId);

    public boolean hasApprovedReservation(Long userId);

    public boolean hasOverlap(Long userId, LocalDate newStart, LocalDate newEnd);

    public Reservation updateApproval(Long reservationId, int status);
}
