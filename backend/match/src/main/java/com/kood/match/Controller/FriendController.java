package com.kood.match.Controller;

import com.kood.match.DTO.UserWithStatuses;
import com.kood.match.Entity.User;
import com.kood.match.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/friend")
public class FriendController {

    private final UserService userService;

    public FriendController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> sendFriendRequestOrAccept(@RequestBody String receiverEmail, @AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(userService.sendFriendRequestOrAccept(receiverEmail, userEmail));
    }

    @DeleteMapping("/request/delete/{friendId}")
    public ResponseEntity<Void> cancelFriendRequest(@PathVariable Long friendId, @AuthenticationPrincipal String clientEmail) {
        userService.deleteIfRequestExists(friendId, clientEmail);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<Void> removeFriend(@PathVariable Long friendId, @AuthenticationPrincipal String clientEmail) {
        userService.removeFriend(friendId, clientEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getFriends(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(userService.getAllFriends(userEmail));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<User>> getFriendRequests(@AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(userService.getAllRequests(userEmail));
    }

}