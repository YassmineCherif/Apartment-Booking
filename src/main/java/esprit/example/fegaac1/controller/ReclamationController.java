package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.ETAT_RECLAMATION;
import esprit.example.fegaac1.entities.Reclamation;
import esprit.example.fegaac1.services.ReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reclamations")
@RequiredArgsConstructor
public class ReclamationController {

    private final ReclamationService reclamationService;

    @PostMapping("/add/{userId}")
    public Reclamation addReclamation(@PathVariable Long userId, @RequestBody Reclamation rec) {
        return reclamationService.addReclamation(userId, rec);
    }

    @GetMapping("/user/{userId}")
    public List<Reclamation> getUserReclamations(@PathVariable Long userId) {
        return reclamationService.getUserReclamations(userId);
    }

    @GetMapping("/all")
    public List<Reclamation> getAll() {
        return reclamationService.getAll();
    }


    @PutMapping("/update/{id}")
    public Reclamation updateReclamation(@PathVariable Long id, @RequestBody Reclamation rec) {
        return reclamationService.updateReclamation(id, rec);
    }

    @PutMapping("/status/{id}")
    public Reclamation updateStatus(@PathVariable Long id, @RequestParam ETAT_RECLAMATION status) {
        return reclamationService.updateStatus(id, status);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        reclamationService.delete(id);
    }
}
