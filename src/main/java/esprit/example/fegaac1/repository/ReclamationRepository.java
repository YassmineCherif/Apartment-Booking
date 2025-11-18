package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {


    @Query("SELECT r FROM Reclamation r WHERE r.user.id_user = :userId")
    List<Reclamation> findByUserId(@Param("userId") Long userId);

}
