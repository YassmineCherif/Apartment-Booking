package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.USER_ROLE;
import esprit.example.fegaac1.entities.User;
import esprit.example.fegaac1.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import org.springframework.mail.javamail.JavaMailSender;

@Service
public class UserService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Fetch all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByLoginOrEmail(String loginOrEmail) {
        User user = userRepository.findByLogin(loginOrEmail);
        if (user == null) {
            user = userRepository.findByEmail(loginOrEmail);
        }
        if (user == null) {
            throw new EntityNotFoundException("Utilisateur introuvable avec le login/email : " + loginOrEmail);
        }
        return user;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public List<User> findPendingUsers() {
        return userRepository.findByApproved(2);
    }

    public void setApproval(Long userId, int approved) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable avec l'id : " + userId));
        user.setApproved(approved);
        userRepository.save(user);
    }

    public void updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

        existing.setNom(updatedUser.getNom());
        existing.setPrenom(updatedUser.getPrenom());
        existing.setEmail(updatedUser.getEmail());
        existing.setAdresse(updatedUser.getAdresse());
        existing.setNumerotelephone(updatedUser.getNumerotelephone());
        if (updatedUser.getMdp() != null && !updatedUser.getMdp().isEmpty()) {
            existing.setMdp(updatedUser.getMdp());
        }

        userRepository.save(existing);
    }





    public User registerUser(Map<String, Object> userMap) throws IllegalArgumentException {
        String email = (String) userMap.get("email");
        String login = (String) userMap.get("login");

        if (userRepository.findByEmail(email) != null) {
            throw new IllegalArgumentException("EMAIL_EXISTS");
        }

        if (userRepository.findByLogin(login) != null) {
            throw new IllegalArgumentException("LOGIN_EXISTS");
        }

        User user = new User();
        user.setNom((String) userMap.get("nom"));
        user.setPrenom((String) userMap.get("prenom"));
        user.setEmail(email);
        user.setNumerotelephone((String) userMap.get("numerotelephone"));
        user.setAdresse((String) userMap.get("adresse"));
        user.setLogin(login);
        user.setMdp((String) userMap.get("mdp"));
        user.setActif(true);
        user.setApproved(2);
        user.setCin("");
        user.setDerniercnx("");

        String roleStr = (String) userMap.get("userRole");
        user.setUserRole(USER_ROLE.valueOf(roleStr));

        return userRepository.save(user);
    }




    // ------------- email ------------------------

    public void sendSimpleEmail(String toEmail,
                                String subject,
                                String body
    ) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("indila205@gmail.com");
        message.setTo(toEmail);
        message.setText(body);
        message.setSubject(subject);
        mailSender.send(message);
        System.out.println("Email envoyé avec succès...");
    }



    public void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("indila205@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML
            mailSender.send(message);
            System.out.println("Email envoyé avec succès...");
        } catch (MessagingException e) {
            System.err.println("Erreur lors de l'envoi de l'email à " + toEmail + ": " + e.getMessage());
        }
    }


    public void resetPassword(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new IllegalArgumentException("Aucun utilisateur trouvé avec l'adresse e-mail fournie");
        }

        try {
            String newPassword = generateRandomPassword();

            user.setMdp(newPassword);
            userRepository.save(user);

            String subject = "Réinitialisation de votre mot de passe";
            String htmlMessage = "<html>" +
                    "<body style='font-family: Arial, sans-serif; line-height: 1.6;'>" +
                    "<p>Bonjour <strong>" + user.getPrenom() + " " + user.getNom() + "</strong>,</p>" +
                    "<p>Votre mot de passe a été réinitialisé.</p>" +
                    "<p>Nouveau mot de passe : <strong style='color:#d9534f;'>" + newPassword + "</strong></p>" +
                    "<p>Pour votre sécurité, veuillez changer ce mot de passe immédiatement après votre connexion.</p>" +
                    "<p>Cordialement,<br/>" +
                    "L'équipe de support Figeac Aero</p>" +
                    "</body></html>";

            sendEmail(user.getEmail(), subject, htmlMessage, true);

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Email envoyé mais un avertissement interne s'est produit.");
        }
    }

    private String generateRandomPassword() {
        return RandomStringUtils.random(3, true, false) +
                RandomStringUtils.random(3, false, true) +
                RandomStringUtils.random(2, 33, 47, false, false);
    }

    private void sendEmail(String toEmail, String subject, String body, boolean isHtml) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("indila205@gmail.com");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body, isHtml);

        mailSender.send(message);
    }
}
