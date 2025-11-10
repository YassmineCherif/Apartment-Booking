package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.Bloc;
import esprit.example.fegaac1.entities.Residence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BlocRepository extends JpaRepository<Bloc, Long> {

    @Query("SELECT b FROM Bloc b WHERE b.id_residence = :residenceId")
    List<Bloc> findByIdResidence(@Param("residenceId") Long residenceId);



}
