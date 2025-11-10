package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.EmailRequest;
import esprit.example.fegaac1.entities.USER_ROLE;
import esprit.example.fegaac1.entities.User;
import esprit.example.fegaac1.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String login,
                                                     @RequestParam String password,
                                                     HttpSession session) {
        Map<String, String> response = new HashMap<>();
        try {
            User user = userService.findByLoginOrEmail(login);

            if (password.equals(user.getMdp())) {
                if (user.getApproved() == 1) { // only allow approved users
                    session.setAttribute("USER_LOGIN", user.getLogin());
                    session.setAttribute("USER_ROLE", user.getUser_role());
                    response.put("message", "Connexion réussie");
                    response.put("role", user.getUser_role() != null ? user.getUser_role().name() : USER_ROLE.CLIENT.name());
                    return ResponseEntity.ok(response);
                } else if (user.getApproved() == 2) {
                    response.put("message", "Validation de l'utilisateur en attente");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                } else {
                    response.put("message", "Utilisateur refusé");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
            } else {
                response.put("message", "Login ou mot de passe invalide");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (EntityNotFoundException e) {
            response.put("message", "Login ou mot de passe invalide");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        try {
            if (user.getUser_role() == null) {
                user.setUser_role(USER_ROLE.CLIENT);
            }

            user.setActif(true);
            user.setApproved(2); // par défaut : en attente

            userService.save(user);
            response.put("message", "Inscription réussie");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Échec de l'inscription");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.findPendingUsers());
    }

    @PutMapping("/{id}/approval")
    public ResponseEntity<Void> setApproval(@PathVariable("id") Long id, @RequestParam("approved") int approved) {
        userService.setApproval(id, approved);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile/{login}")
    public ResponseEntity<User> getUserProfile(@PathVariable String login) {
        User user = userService.findByLoginOrEmail(login);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String,String>> updateUserProfile(
            @PathVariable Long id, @RequestBody User updatedUser) {
        Map<String,String> response = new HashMap<>();
        try {
            userService.updateUser(id, updatedUser);
            response.put("message", "Profil mis à jour avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Échec de la mise à jour du profil");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // -------------- email ----------------------
    @PostMapping("/send-email")
    public void sendEmail(@RequestBody EmailRequest emailRequest) {
        userService.sendSimpleEmail(emailRequest.getToEmail(), emailRequest.getSubject(), emailRequest.getBody());
    }

    @PostMapping("/forgot-password/{email}")
    public ResponseEntity<String> forgotPassword(@PathVariable String email) {
        try {
            userService.resetPassword(email);
            return ResponseEntity.ok("Email de réinitialisation envoyé avec succès");
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur inattendue est survenue");
        }
    }
}
