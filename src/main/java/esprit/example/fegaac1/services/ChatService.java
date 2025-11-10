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

    // Create a new message in a conversation
    public Message sendMessage(Long conversationId, Long senderId, String content, Set<Fichier> fichiers) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setDateCreation(LocalDateTime.now());
        message.setFichiers(fichiers);

        conversation.getMessages().add(message);
        conversation.setLastMessageAt(LocalDateTime.now());

        conversationRepository.save(conversation);
        return message;
    }

    // Get messages for a conversation
    public List<Message> getMessages(Long conversationId) {
        return messageRepository.findByConversationIdConversationOrderByDateCreationAsc(conversationId);
    }
}
