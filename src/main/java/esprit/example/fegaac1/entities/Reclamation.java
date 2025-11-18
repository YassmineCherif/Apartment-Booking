package esprit.example.fegaac1.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_reclamation;

    private String description;
    private String titre;
    private String localisation ;

    @Enumerated(EnumType.STRING)
    private ETAT_RECLAMATION etatReclamation = ETAT_RECLAMATION.EN_ATTENTE;

    private LocalDate date = LocalDate.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"reclamations"})
    private User user;

}
