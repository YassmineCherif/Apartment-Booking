package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.Pays;
import esprit.example.fegaac1.entities.Residence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResidenceRepository extends JpaRepository<Residence, Long> {


        @Query("SELECT r FROM Residence r WHERE r.id_pays = :paysId")
        List<Residence> findByIdPays(@Param("paysId") Long paysId);


}
