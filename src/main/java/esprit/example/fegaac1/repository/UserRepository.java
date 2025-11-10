package esprit.example.fegaac1.repository;

import esprit.example.fegaac1.entities.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByLogin(String login);
    User findByEmail(String email);
    List<User> findByApproved(int approved);
}
