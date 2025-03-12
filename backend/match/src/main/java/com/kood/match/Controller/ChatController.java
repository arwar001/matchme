package com.kood.match.Controller;

import com.kood.match.Entity.Message;
import com.kood.match.Exceptions.EntityMalformed;
import com.kood.match.Service.ChatRoomService;
import com.kood.match.Service.MessageService;
import com.kood.match.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserService userService;
    private final ChatRoomService chatRoomService;

    @PostMapping("/messages/send/{receiverId}")
    public ResponseEntity<Message> saveAndSendMessage(@RequestBody String content, @PathVariable Long receiverId, @AuthenticationPrincipal String senderEmail) {
        String receiverEmail = userService.findUserById(receiverId).getEmail();
        Long senderId = userService.findUserByEmail(senderEmail).getId();
        Message message = messageService.saveMessage(senderId, receiverId, content);
        messagingTemplate.convertAndSendToUser(receiverEmail, "/queue/messages", message);
        messagingTemplate.convertAndSendToUser(senderEmail, "/queue/messages", message);
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/messages/delete/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long messageId, @AuthenticationPrincipal String userEmail) {
        Message message = messageService.findMessageById(messageId);
        Long userId = userService.findUserByEmail(userEmail).getId();
        if (!messageService.isOwnerOfMessage(messageId, userId)) {
            throw new EntityMalformed("You are not the owner of this message");
        }
        messageService.deleteMessage(message);
        Map<String, Long> deleteRequest = Map.of("deleteId", messageId);
        String friendEmail = userService.findUserById(message.getReceiverId()).getEmail();
        messagingTemplate.convertAndSendToUser(userEmail, "/queue/messages", deleteRequest);
        messagingTemplate.convertAndSendToUser(friendEmail, "/queue/messages", deleteRequest);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/messages/{senderId}/{receiverId}")
    public ResponseEntity<Page<Message>> getChatHistory(@PathVariable Long senderId, @PathVariable Long receiverId, @RequestParam int page, @RequestParam int pageSize) {
        return ResponseEntity.ok(messageService.findChatMessages(senderId, receiverId, page, pageSize));
    }
}