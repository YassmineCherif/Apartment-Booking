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

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;



@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;
    private final FichierRepository fichierRepository;
    private final UserRepository userRepository;

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
        if (files != null) {
            for (MultipartFile file : files) {
                Fichier f = new Fichier();
                f.setTitre(file.getOriginalFilename());
                f.setDateCreation(LocalDateTime.now());
                String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1).toLowerCase();
                switch(ext) {
                    case "pdf": f.setTypeFichier(TYPE_FICHIER.FACTURE); break;
                    case "jpg": case "jpeg": case "png": f.setTypeFichier(TYPE_FICHIER.IMAGE); break;
                    default: f.setTypeFichier(TYPE_FICHIER.DOCUMENT);
                }
                fichiers.add(f);
            }
        }
        return ResponseEntity.ok(chatService.sendMessage(conversationId, senderId, content, fichiers));
    }




    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Fichier f = fichierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
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
            // If the role string is invalid, return all users
            return ResponseEntity.ok(userRepository.findAll());
        }

        return ResponseEntity.ok(userRepository.findByUserRoleNot(roleToExclude));
    }







}
