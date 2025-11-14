package esprit.example.fegaac1.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_message;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime dateCreation;

    @ManyToOne
    @JoinColumn(name = "id_sender")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "id_conversation")
    @JsonBackReference
    private Conversation conversation;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_message")
    private Set<Fichier> fichiers;
}