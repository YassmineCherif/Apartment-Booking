package esprit.example.fegaac1.entities;



import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bloc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_bloc;

    private String nom;
    private int nombreEtages;


    @OneToMany
    private Set<Appartement> appartement;

    private Long  id_residence ;



}
