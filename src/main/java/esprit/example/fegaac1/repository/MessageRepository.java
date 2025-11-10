package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdConversationOrderByDateCreationAsc(Long conversationId);
}