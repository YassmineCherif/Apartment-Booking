package esprit.example.fegaac1.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_reservation;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private int approved ;

    @ManyToOne
    Appartement  appartements;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}