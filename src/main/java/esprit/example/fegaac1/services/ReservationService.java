package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ReservationService implements IReservationService {

    private final PaysRepository paysRepository;
    private final ResidenceRepository residenceRepository;
    private final BlocRepository blocRepository;
    private final AppartementRepository appartementRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    // Récupérer tous les pays
    public List<Pays> getAllPays() {
        return paysRepository.findAll();
    }

    // Récupérer les résidences d’un pays spécifique
    public Set<Residence> getResidencesByPays(Long paysId) {
        return paysRepository.findById(paysId)
                .map(Pays::getResidences)
                .orElse(Collections.emptySet());
    }

    // Récupérer les blocs d’une résidence spécifique
    public Set<Bloc> getBlocsByResidence(Long residenceId) {
        return residenceRepository.findById(residenceId)
                .map(Residence::getBlocs)
                .orElse(Collections.emptySet());
    }

    // Récupérer les appartements d’un bloc spécifique
    public Set<Appartement> getAppartementsByBloc(Long blocId) {
        return blocRepository.findById(blocId)
                .map(Bloc::getAppartement)
                .orElse(Collections.emptySet());
    }

    public Reservation createReservation(Long appartementId, LocalDate start, LocalDate end) {
        Appartement appartement = appartementRepository.findById(appartementId)
                .orElseThrow(() -> new RuntimeException("Appartement introuvable"));
        Reservation reservation = new Reservation();
        reservation.setAppartements(appartement);
        reservation.setDateDebut(start);
        reservation.setDateFin(end);
        reservation.setApproved(2); // par défaut
        return reservationRepository.save(reservation);
    }

    public Reservation reserverAppartement(Long appartementId, Long userId, LocalDate dateDebut, LocalDate dateFin) {
        Appartement appartement = appartementRepository.findById(appartementId)
                .orElseThrow(() -> new IllegalArgumentException("Appartement introuvable avec l'id : " + appartementId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable avec l'id : " + userId));

        // Validation des dates
        if (dateDebut == null || dateFin == null || dateDebut.isAfter(dateFin)) {
            throw new IllegalArgumentException("Dates de réservation invalides");
        }

        // Vérification des chevauchements
        boolean hasOverlap = hasOverlap(userId, dateDebut, dateFin);
        if (hasOverlap) {
            throw new IllegalArgumentException("Vous avez déjà une réservation qui chevauche ces dates");
        }

        Reservation reservation = new Reservation();
        reservation.setAppartements(appartement);
        reservation.setUser(user);
        reservation.setDateDebut(dateDebut);
        reservation.setDateFin(dateFin);
        reservation.setApproved(2);

        return reservationRepository.save(reservation);
    }

    public boolean existsByUserAndAppartement(Long userId, Long appartementId) {
        return reservationRepository.existsReservation(userId, appartementId);
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        return reservationRepository.findByUser(user);
    }

    public boolean hasApprovedReservation(Long userId) {
        return reservationRepository.existsByUserIdAndApproved(userId, 1);
    }

    public boolean hasOverlap(Long userId, LocalDate newStart, LocalDate newEnd) {
        System.out.println("Backend : vérification de chevauchement pour l'utilisateur " + userId +
                " du " + newStart + " au " + newEnd);

        List<Reservation> approvedReservations = reservationRepository.findApprovedReservationsByUser(userId);

        for (Reservation r : approvedReservations) {
            System.out.println("Backend : réservation approuvée existante = " +
                    r.getDateDebut() + " -> " + r.getDateFin());
            if (!(newEnd.isBefore(r.getDateDebut()) || newStart.isAfter(r.getDateFin()))) {
                System.out.println("Backend : chevauchement détecté !");
                return true;
            }
        }
        System.out.println("Backend : aucun chevauchement");
        return false;
    }

    public Reservation updateApproval(Long reservationId, int status) {
        Reservation r = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation introuvable"));
        r.setApproved(status);
        return reservationRepository.save(r);
    }
}
