package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final FichierRepository fichierRepository;
    private final UserRepository userRepository;

    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdOrderByDateCreationAsc(conversationId);
    }

    public Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
        List<Conversation> existing = conversationRepository.findConversationBetweenUsers(user1Id, user2Id);
        if (!existing.isEmpty()) return existing.get(0);

        Conversation conv = new Conversation();
        conv.setCreatedAt(LocalDateTime.now());
        conv.setLastMessageAt(LocalDateTime.now());

        User u1 = userRepository.findById(user1Id).orElseThrow();
        User u2 = userRepository.findById(user2Id).orElseThrow();
        conv.setParticipants(Set.of(u1, u2));
        return conversationRepository.save(conv);
    }

    public Message sendMessage(Long conversationId, Long senderId, String content, Set<Fichier> fichiers) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();
        User sender = userRepository.findById(senderId).orElseThrow();

        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setDateCreation(LocalDateTime.now());
        message.setConversation(conversation);

        if (fichiers != null && !fichiers.isEmpty()) {
            fichiers.forEach(fichierRepository::save);
            message.setFichiers(fichiers);
        }

        messageRepository.save(message);

        conversation.setLastMessageAt(LocalDateTime.now());
        conversation.getMessages().add(message);
        conversationRepository.save(conversation);

        return message;
    }
}
