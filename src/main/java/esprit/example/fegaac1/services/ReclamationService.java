package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.ETAT_RECLAMATION;
import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.ReclamationRepository;
import esprit.example.fegaac1.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReclamationService {

    private final ReclamationRepository reclamationRepository;
    private final UserRepository userRepository;

    public Reclamation addReclamation(Long userId, Reclamation rec) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        rec.setUser(user);
        rec.setDate(LocalDate.now());
        rec.setEtatReclamation(ETAT_RECLAMATION.EN_ATTENTE); // DEFAULT

        return reclamationRepository.save(rec);
    }

    public List<Reclamation> getUserReclamations(Long userId) {
        return reclamationRepository.findByUserId(userId);
    }

    public List<Reclamation> getAll() {
        return reclamationRepository.findAll(); // user doit être fetché automatiquement
    }


    public Reclamation updateReclamation(Long id, Reclamation rec) {

        Reclamation existing = reclamationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reclamation not found"));

        existing.setTitre(rec.getTitre());
        existing.setDescription(rec.getDescription());
        existing.setLocalisation(rec.getLocalisation());
        // status NOT editable here, only admin updates
        return reclamationRepository.save(existing);
    }

    public Reclamation updateStatus(Long id, ETAT_RECLAMATION status) {
        Reclamation rec = reclamationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reclamation not found"));

        rec.setEtatReclamation(status);
        return reclamationRepository.save(rec);
    }

    public void delete(Long id) {
        reclamationRepository.deleteById(id);
    }
}
