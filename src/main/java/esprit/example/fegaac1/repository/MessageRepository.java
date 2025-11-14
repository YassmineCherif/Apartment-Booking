package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {


    @Query("SELECT m FROM Message m WHERE m.conversation.id_conversation = :conversationId ORDER BY m.dateCreation ASC")
    List<Message> findByConversationIdOrderByDateCreationAsc(@Param("conversationId") Long conversationId);


}