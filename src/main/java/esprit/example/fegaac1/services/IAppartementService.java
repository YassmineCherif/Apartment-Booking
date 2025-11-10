package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;

import java.util.List;
import java.util.Optional;

public interface IAppartementService {


    // ===================== PAYS =====================
    Pays addPays(Pays pays);
    Pays updatePays(Pays pays);
    void deletePays(Long id);
    Optional<Pays> getPaysById(Long id);
    List<Pays> getAllPays();

    // ===================== RESIDENCE =====================
    Residence addResidence(Residence residence);
    Residence updateResidence(Residence residence);
    void deleteResidence(Long id);
    Optional<Residence> getResidenceById(Long id);
    List<Residence> getAllResidences();
    List<Residence> getResidencesByPays(Long paysId);

    // ===================== BLOC =====================
    Bloc addBloc(Bloc bloc);
    Bloc updateBloc(Bloc bloc);
    void deleteBloc(Long id);
    Optional<Bloc> getBlocById(Long id);
    List<Bloc> getAllBlocs();
    List<Bloc> getBlocsByResidence(Long residenceId);

    // ===================== APPARTEMENT =====================
    Appartement addAppartement(Appartement appartement);
    Appartement updateAppartement(Appartement appartement);
    void deleteAppartement(Long id);
    Optional<Appartement> getAppartementById(Long id);
    List<Appartement> getAllAppartements();
    List<Appartement> getAppartementsByBloc(Long blocId);
}