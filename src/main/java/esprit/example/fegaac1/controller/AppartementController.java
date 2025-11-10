package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.AppartementRepository;
import esprit.example.fegaac1.services.AppartementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appartement")
@RequiredArgsConstructor
public class AppartementController {

    private final AppartementService appartementService;
    private final AppartementRepository appartementRepository;

    // ===================== PAYS =====================
    @GetMapping("/pays")
    public List<Pays> getAllPays() {
        return appartementService.getAllPays();
    }

    @GetMapping("/pays/{id}")
    public Optional<Pays> getPaysById(@PathVariable Long id) {
        return appartementService.getPaysById(id);
    }

    @PostMapping("/pays")
    public Pays addPays(@RequestBody Pays pays) {
        return appartementService.addPays(pays);
    }

    @PutMapping("/pays")
    public Pays updatePays(@RequestBody Pays pays) {
        return appartementService.updatePays(pays);
    }

    @DeleteMapping("/pays/{id}")
    public void deletePays(@PathVariable Long id) {
        appartementService.deletePays(id);
    }

    // ===================== RESIDENCE =====================
    @GetMapping("/residences")
    public List<Residence> getAllResidences() {
        return appartementService.getAllResidences();
    }

    @GetMapping("/residences/{id}")
    public Optional<Residence> getResidenceById(@PathVariable Long id) {
        return appartementService.getResidenceById(id);
    }

    @GetMapping("/residences/byPays/{paysId}")
    public List<Residence> getResidencesByPays(@PathVariable Long paysId) {
        return appartementService.getResidencesByPays(paysId);
    }

    @PostMapping("/residences")
    public Residence addResidence(@RequestBody Residence residence) {
        return appartementService.addResidence(residence);
    }

    @PutMapping("/residences")
    public Residence updateResidence(@RequestBody Residence residence) {
        return appartementService.updateResidence(residence);
    }

    @DeleteMapping("/residences/{id}")
    public void deleteResidence(@PathVariable Long id) {
        appartementService.deleteResidence(id);
    }

    // ===================== BLOC =====================
    @GetMapping("/blocs")
    public List<Bloc> getAllBlocs() {
        return appartementService.getAllBlocs();
    }

    @GetMapping("/blocs/{id}")
    public Optional<Bloc> getBlocById(@PathVariable Long id) {
        return appartementService.getBlocById(id);
    }

    @GetMapping("/blocs/byResidence/{residenceId}")
    public List<Bloc> getBlocsByResidence(@PathVariable Long residenceId) {
        return appartementService.getBlocsByResidence(residenceId);
    }


    @PostMapping("/blocs")
    public Bloc addBloc(@RequestBody Bloc bloc) {
        return appartementService.addBloc(bloc);
    }

    @PutMapping("/blocs")
    public Bloc updateBloc(@RequestBody Bloc bloc) {
        return appartementService.updateBloc(bloc);
    }

    @DeleteMapping("/blocs/{id}")
    public void deleteBloc(@PathVariable Long id) {
        appartementService.deleteBloc(id);
    }

    // ===================== APPARTEMENT =====================
    @GetMapping("/appartements")
    public List<Appartement> getAllAppartements() {
        return appartementService.getAllAppartements();
    }

    @GetMapping("/appartements/{id}")
    public Optional<Appartement> getAppartementById(@PathVariable Long id) {
        return appartementService.getAppartementById(id);
    }

    @GetMapping("/appartements/byBloc/{blocId}")
    public List<Appartement> getAppartementsByBloc(@PathVariable Long blocId) {
        return appartementService.getAppartementsByBloc(blocId);
    }

    @PostMapping("/appartements")
    public Appartement addAppartement(@RequestBody Appartement appartement) {
        return appartementService.addAppartement(appartement);
    }

    @PutMapping("/appartements")
    public Appartement updateAppartement(@RequestBody Appartement appartement) {
        return appartementService.updateAppartement(appartement);
    }

    @DeleteMapping("/appartements/{id}")
    public void deleteAppartement(@PathVariable Long id) {
        appartementService.deleteAppartement(id);
    }


    @PostMapping("/uploadImage")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "C:/Users/Yasoulanda/OneDrive/Desktop/Figeac/Front/src/assets/images/";
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file");
        }
    }




    @PostMapping("/appartements/upload")
    public ResponseEntity<Appartement> addAppartementWithImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titre") String titre,
            @RequestParam("description") String description,
            @RequestParam("id_bloc") Long id_bloc
    ) {
        try {
            // 1️⃣ Save file
            String uploadDir = "C:/Users/MSI/Desktop/CLSS63/Apartments/Front/src/assets/images/";
            Path path = Paths.get(uploadDir + file.getOriginalFilename());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // 2️⃣ Save Appartement
            Appartement appartement = new Appartement();
            appartement.setTitre(titre);
            appartement.setDescription(description);
            appartement.setId_bloc(id_bloc);
            appartement.setImage("images/" + file.getOriginalFilename());

            Appartement saved = appartementRepository.save(appartement);
            return ResponseEntity.ok(saved);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}
