package esprit.example.fegaac1.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pays {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_country;

    private String pays;
    private String localisation;
    private String adress;
    private String ville;

    @OneToMany
    private Set<Residence> residences;


}
