// ============================================
// UPDATED ChatService.java
// ============================================

package esprit.example.fegaac1.services;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final FichierRepository fichierRepository;
    private final UserRepository userRepository;

    public List<Conversation> getAllConversations() {
        return conversationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private Conversation toDTO(Conversation conv) {
        Conversation dto = new Conversation();
        dto.setId_conversation(conv.getId_conversation());
        dto.setCreatedAt(conv.getCreatedAt());
        dto.setLastMessageAt(conv.getLastMessageAt());
        dto.setParticipants(conv.getParticipants()); // This will be loaded
        // Don't include messages - load them separately via getMessages()
        return dto;
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

        // Use HashSet for JPA compatibility
        conv.setParticipants(new HashSet<>(Set.of(u1, u2)));

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
        conversationRepository.save(conversation);

        return message;
    }
}

// ============================================
// UPDATED Conversation.java Entity
// ============================================

package esprit.example.fegaac1.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_conversation;

    // REMOVED: private String subject;

    private LocalDateTime createdAt;

    private LocalDateTime lastMessageAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JsonIgnore
    private Set<Message> messages;

    @ManyToMany
    @JoinTable(
            name = "conversation_participant",
            joinColumns = @JoinColumn(name = "id_conversation"),
            inverseJoinColumns = @JoinColumn(name = "id_user")
    )
    private Set<User> participants;
}

// ============================================
// ChatController.java (No changes needed - already correct)
// ============================================

package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.repository.FichierRepository;
import esprit.example.fegaac1.repository.UserRepository;
import esprit.example.fegaac1.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final FichierRepository fichierRepository;
    private final UserRepository userRepository;

    // Path to assets/Documents folder
    private static final String ASSETS_FOLDER = "C:\\Users\\Yasoulanda\\OneDrive\\Desktop\\K\\Figeac1\\Front\\src\\assets\\Documents";

    @GetMapping("/conversations")
    public ResponseEntity<List<Conversation>> getConversations() {
        return ResponseEntity.ok(chatService.getAllConversations());
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }

    @PostMapping("/conversation-or-create")
    public ResponseEntity<Conversation> getOrCreateConversation(@RequestParam Long user1Id, @RequestParam Long user2Id) {
        return ResponseEntity.ok(chatService.getOrCreateConversation(user1Id, user2Id));
    }

    @PostMapping("/{conversationId}/{senderId}")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long conversationId,
            @PathVariable Long senderId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> files
    ) {
        Set<Fichier> fichiers = new HashSet<>();

        if (files != null && !files.isEmpty()) {
            // Create assets/Documents folder if it doesn't exist
            File assetsDir = new File(ASSETS_FOLDER);
            if (!assetsDir.exists()) {
                assetsDir.mkdirs();
            }

            for (MultipartFile file : files) {
                try {
                    // Generate unique filename to avoid conflicts
                    String originalFilename = file.getOriginalFilename();
                    String extension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFilename = UUID.randomUUID().toString() + extension;

                    // Save file to assets/Documents folder
                    Path filePath = Paths.get(ASSETS_FOLDER, uniqueFilename);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // Create Fichier entity
                    Fichier f = new Fichier();
                    f.setTitre(originalFilename);
                    f.setDateCreation(LocalDateTime.now());

                    // Set file path - just the filename (frontend will prepend /assets/Documents/)
                    f.setChemin(uniqueFilename);

                    // Determine file type
                    String ext = extension.toLowerCase();
                    switch(ext) {
                        case ".pdf":
                            f.setTypeFichier(TYPE_FICHIER.FACTURE);
                            break;
                        case ".jpg":
                        case ".jpeg":
                        case ".png":
                        case ".gif":
                        case ".webp":
                            f.setTypeFichier(TYPE_FICHIER.IMAGE);
                            break;
                        default:
                            f.setTypeFichier(TYPE_FICHIER.DOCUMENT);
                    }

                    fichiers.add(f);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
                }
            }
        }

        return ResponseEntity.ok(chatService.sendMessage(conversationId, senderId, content, fichiers));
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Fichier f = fichierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
            // If file has a chemin, use it from assets/Documents
            if (f.getChemin() != null) {
                // chemin contains just the filename
                Path path = Paths.get(ASSETS_FOLDER, f.getChemin());
                Resource resource = new UrlResource(path.toUri());

                if (resource.exists() && resource.isReadable()) {
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + f.getTitre() + "\"")
                            .body(resource);
                }
            }

            // Fallback to old uploads folder (for backward compatibility)
            Path path = Paths.get("uploads/" + f.getTitre());
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found or not readable");
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + f.getTitre() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) {
            throw new RuntimeException("Error while reading file", e);
        }
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getContactsExcludingRole(
            @RequestParam(name = "excludeRole", required = false) String excludeRole) {

        if (excludeRole == null || excludeRole.isEmpty()) {
            return ResponseEntity.ok(userRepository.findAll());
        }

        USER_ROLE roleToExclude;
        try {
            roleToExclude = USER_ROLE.valueOf(excludeRole.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(userRepository.findAll());
        }

        return ResponseEntity.ok(userRepository.findByUserRoleNot(roleToExclude));
    }
}

