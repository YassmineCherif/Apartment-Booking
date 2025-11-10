package esprit.example.fegaac1.entities;


 import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_conversation;

    private String subject;
    private LocalDateTime createdAt;
    private LocalDateTime lastMessageAt;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_conversation")
    private Set<Message> messages;

    @ManyToMany
    @JoinTable(
            name = "conversation_participant",
            joinColumns = @JoinColumn(name = "id_conversation"),
            inverseJoinColumns = @JoinColumn(name = "id_user")
    )
    private Set<User> participants;
}