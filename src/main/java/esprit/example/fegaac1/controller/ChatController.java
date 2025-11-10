package esprit.example.fegaac1.controller;

import esprit.example.fegaac1.entities.*;
import esprit.example.fegaac1.services.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/{conversationId}/{senderId}")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long conversationId,
            @PathVariable Long senderId,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> files
    ) {
        // Convert MultipartFile to Fichier entitiesf
        Set<Fichier> fichiers = new HashSet<>();
        if (files != null) {
            files.forEach(file -> {
                Fichier f = new Fichier();
                f.setTitre(file.getOriginalFilename());
                f.setDateCreation(LocalDateTime.now());
                String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1).toUpperCase();
                if (ext.equals("PDF")) f.setTypeFichier(TYPE_FICHIER.FACTURE);
                else f.setTypeFichier(TYPE_FICHIER.IMAGE);
                fichiers.add(f);
            });
        }

        Message message = chatService.sendMessage(conversationId, senderId, content, fichiers);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }
}
