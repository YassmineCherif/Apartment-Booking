package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
            "FROM Reservation r " +
            "WHERE r.user.id_user = :userId AND r.appartements.id_app = :appId")
    boolean existsReservation(@Param("userId") Long userId, @Param("appId") Long appId);


    List<Reservation> findByUser(User user);

    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END " +
            "FROM Reservation r " +
            "WHERE r.user.id = :userId AND r.approved = :approved")
    boolean existsByUserIdAndApproved(@Param("userId") Long userId,
                                      @Param("approved") int approved);


    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.approved = 1")
    List<Reservation> findApprovedReservationsByUser(@Param("userId") Long userId);


}
