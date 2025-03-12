package com.kood.match.Service;

import com.kood.match.Entity.ChatRoom;
import com.kood.match.Exceptions.EntityMalformed;
import com.kood.match.Repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoom createChatRoom(Long userId1, Long userId2) {
        String chatRoomId = createChatRoomId(userId1, userId2);
        if (existsChatRoom(chatRoomId)) {
            return findChatRoomById(chatRoomId);
        }
        ChatRoom chatRoom = new ChatRoom(chatRoomId, userId1, userId2, new Date(), new Date());
        return chatRoomRepository.save(chatRoom);
    }

    public ChatRoom findChatRoomById(String chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityMalformed("Chat room does not exist"));
    }

    public String createChatRoomId(Long userId1, Long userId2) {
        return userId1 < userId2 ? userId1 + "_" + userId2 : userId2 + "_" + userId1;
        //will return the chatRoomId as smallerId_largerId
    }

    public boolean existsChatRoom(String chatRoomId) {
        return chatRoomRepository.existsById(chatRoomId);
    }

    public void updateLastReadDate(String chatRoomId, Long userId) {
        ChatRoom chatRoom = findChatRoomById(chatRoomId);
        if (userId == chatRoom.getUserId1()) {
            chatRoom.setLastUser1ReadDate(new Date());
        } else if (userId == chatRoom.getUserId2()) {
            chatRoom.setLastUser2ReadDate(new Date());
        } else {
            throw new EntityMalformed("User does not belong to this chat room");
        }
        chatRoomRepository.save(chatRoom);
    }
}