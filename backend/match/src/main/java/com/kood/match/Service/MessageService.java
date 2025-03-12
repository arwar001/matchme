package com.kood.match.Service;

import com.kood.match.Entity.Message;
import com.kood.match.Exceptions.EntityMalformed;
import com.kood.match.Repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRoomService chatRoomService;

    public Message saveMessage(Long senderId, Long receiverId, String content) {
        String chatRoomId = chatRoomService.createChatRoomId(senderId, receiverId);
        if (!chatRoomService.existsChatRoom(chatRoomId)) {
            throw new EntityMalformed("Chat room does not exist");
        }
        Message message = new Message(chatRoomId, senderId, receiverId, content, new Date());
        return messageRepository.save(message);
    }

    public Message findMessageById(Long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityMalformed("Message does not exist"));
    }

    public void deleteMessage(Message message) {
        messageRepository.delete(message);
    }

    public boolean isOwnerOfMessage(Long messageId, Long userId) {
        Message message = findMessageById(messageId);
        return message.getSenderId() == userId;
    }

    public Page<Message> findChatMessages(Long senderId, Long receiverId, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("timestamp").descending());
        String chatRoomId = chatRoomService.createChatRoomId(senderId, receiverId);
        chatRoomService.existsChatRoom(chatRoomId);
        return messageRepository.findByChatRoomId(chatRoomId, pageable);
    }

}