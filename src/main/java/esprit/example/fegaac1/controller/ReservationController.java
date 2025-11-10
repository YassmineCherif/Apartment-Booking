package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.ReservationRepository;
import esprit.example.fegaac1.services.IReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final IReservationService reservationService;
    private final ReservationRepository reservationRepository;

    @GetMapping("/pays")
    public List<Pays> getAllPays() {
        return reservationService.getAllPays();
    }

    @GetMapping("/residences/{paysId}")
    public Set<Residence> getResidences(@PathVariable Long paysId) {
        return reservationService.getResidencesByPays(paysId);
    }

    @GetMapping("/blocs/{residenceId}")
    public Set<Bloc> getBlocs(@PathVariable Long residenceId) {
        return reservationService.getBlocsByResidence(residenceId);
    }

    @GetMapping("/appartements/{blocId}")
    public Set<Appartement> getAppartements(@PathVariable Long blocId) {
        return reservationService.getAppartementsByBloc(blocId);
    }

    @PostMapping("/{appartementId}")
    public Reservation createReservation(
            @PathVariable Long appartementId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return reservationService.createReservation(appartementId, start, end);
    }

    @PostMapping("/reserver/{appartementId}")
    public ResponseEntity<?> reserverAppartement(
            @PathVariable Long appartementId,
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFin
    ) {
        try {
            Reservation reservation = reservationService.reserverAppartement(appartementId, userId, dateDebut, dateFin);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // e.g., "Appartement introuvable" or "Dates invalides"
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Une erreur inattendue est survenue lors de la réservation");
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> isReserved(
            @RequestParam Long appartementId,
            @RequestParam Long userId
    ) {
        boolean exists = reservationService.existsByUserAndAppartement(userId, appartementId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @GetMapping("/hasApproved/{userId}")
    public boolean hasApprovedReservation(@PathVariable Long userId) {
        return reservationService.hasApprovedReservation(userId);
    }

    @GetMapping("/reservations/overlap")
    public boolean checkOverlap(
            @RequestParam Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return reservationService.hasOverlap(userId, start, end);
    }

    @PutMapping("/approval/{id}")
    public ResponseEntity<?> updateApproval(
            @PathVariable Long id,
            @RequestParam int status
    ) {
        try {
            Reservation res = reservationService.updateApproval(id, status);
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Réservation introuvable");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Une erreur inattendue est survenue lors de la mise à jour de l'approbation");
        }
    }

    @GetMapping("/all")
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}
