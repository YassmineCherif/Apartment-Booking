package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AppartementService implements IAppartementService {

    private final AppartementRepository appartementRepository;
    private final BlocRepository blocRepository;
    private final PaysRepository paysRepository;
    private final ResidenceRepository residenceRepository;

    // ===================== PAYS =====================
    public Pays addPays(Pays pays) {
        return paysRepository.save(pays);
    }

    public Pays updatePays(Pays pays) {
        if (pays.getId_country() == null) throw new IllegalArgumentException("L'ID du pays ne peut pas être nul");
        Pays p = paysRepository.findById(pays.getId_country())
                .orElseThrow(() -> new IllegalArgumentException("Pays introuvable"));
        p.setPays(pays.getPays());
        p.setLocalisation(pays.getLocalisation());
        p.setAdress(pays.getAdress());
        p.setVille(pays.getVille());
        return paysRepository.save(p);
    }

    public void deletePays(Long id) {
        if (!paysRepository.existsById(id)) throw new IllegalArgumentException("Pays introuvable");
        paysRepository.deleteById(id);
    }

    public Optional<Pays> getPaysById(Long id) {
        return paysRepository.findById(id);
    }

    public List<Pays> getAllPays() {
        return paysRepository.findAll();
    }

    // ===================== RESIDENCE =====================
    public Residence addResidence(Residence residence) {
        return residenceRepository.save(residence);
    }

    public Residence updateResidence(Residence residence) {
        if (residence.getId_residence() == null) throw new IllegalArgumentException("L'ID de la résidence ne peut pas être nul");
        Residence r = residenceRepository.findById(residence.getId_residence())
                .orElseThrow(() -> new IllegalArgumentException("Résidence introuvable"));
        r.setNom(residence.getNom());
        r.setNombrebloc(residence.getNombrebloc());
        r.setId_pays(residence.getId_pays()); // Mise à jour du pays
        return residenceRepository.save(r);
    }

    public void deleteResidence(Long id) {
        if (!residenceRepository.existsById(id)) throw new IllegalArgumentException("Résidence introuvable");
        residenceRepository.deleteById(id);
    }

    public Optional<Residence> getResidenceById(Long id) {
        return residenceRepository.findById(id);
    }

    public List<Residence> getAllResidences() {
        return residenceRepository.findAll();
    }

    public List<Residence> getResidencesByPays(Long paysId) {
        return residenceRepository.findByIdPays(paysId);
    }

    // ===================== BLOC =====================
    public Bloc addBloc(Bloc bloc) {
        if (bloc.getId_residence() == null) {
            throw new IllegalArgumentException("L'ID de la résidence ne peut pas être nul lors de la création d'un bloc");
        }
        return blocRepository.save(bloc);
    }

    public Bloc updateBloc(Bloc bloc) {
        if (bloc.getId_bloc() == null) {
            throw new IllegalArgumentException("L'ID du bloc ne peut pas être nul");
        }

        Bloc b = blocRepository.findById(bloc.getId_bloc())
                .orElseThrow(() -> new IllegalArgumentException("Bloc introuvable"));

        b.setNom(bloc.getNom());
        b.setNombreEtages(bloc.getNombreEtages());

        if (bloc.getId_residence() != null) {
            b.setId_residence(bloc.getId_residence());
        }

        return blocRepository.save(b);
    }

    public void deleteBloc(Long id) {
        if (!blocRepository.existsById(id)) throw new IllegalArgumentException("Bloc introuvable");
        blocRepository.deleteById(id);
    }

    public Optional<Bloc> getBlocById(Long id) {
        return blocRepository.findById(id);
    }

    public List<Bloc> getAllBlocs() {
        return blocRepository.findAll();
    }

    public List<Bloc> getBlocsByResidence(Long residenceId) {
        return blocRepository.findByIdResidence(residenceId);
    }

    // ===================== APPARTEMENT =====================
    public Appartement addAppartement(Appartement appartement) {
        if (appartementRepository.findByTitre(appartement.getTitre()).isPresent()) {
            throw new IllegalArgumentException("Un appartement avec ce titre existe déjà");
        }
        if (appartement.getImage() == null) {
            appartement.setImage("");
        }
        return appartementRepository.save(appartement);
    }

    public Appartement updateAppartement(Appartement appartement) {
        if (appartement.getId_app() == null) throw new IllegalArgumentException("L'ID de l'appartement ne peut pas être nul");

        Optional<Appartement> existing = appartementRepository.findByTitre(appartement.getTitre());
        if (existing.isPresent() && !existing.get().getId_app().equals(appartement.getId_app())) {
            throw new IllegalArgumentException("Un autre appartement avec ce titre existe déjà");
        }

        Appartement a = appartementRepository.findById(appartement.getId_app())
                .orElseThrow(() -> new IllegalArgumentException("Appartement introuvable"));

        a.setTitre(appartement.getTitre());
        a.setDescription(appartement.getDescription());
        return appartementRepository.save(a);
    }

    public void deleteAppartement(Long id) {
        if (!appartementRepository.existsById(id)) throw new IllegalArgumentException("Appartement introuvable");
        appartementRepository.deleteById(id);
    }

    public Optional<Appartement> getAppartementById(Long id) {
        return appartementRepository.findById(id);
    }

    public List<Appartement> getAllAppartements() {
        return appartementRepository.findAll();
    }

    public List<Appartement> getAppartementsByBloc(Long blocId) {
        return appartementRepository.findByIdBloc(blocId);
    }
}
