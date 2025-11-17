package esprit.example.fegaac1.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fichier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_fichier;

    @Enumerated(EnumType.STRING)
    private TYPE_FICHIER typeFichier; // IMAGE, FACTURE, or DOCUMENT

    private String titre;

    private String chemin; // Path to file in assets folder (e.g., "chat-files/uuid.jpg")

    private LocalDateTime dateCreation;
}