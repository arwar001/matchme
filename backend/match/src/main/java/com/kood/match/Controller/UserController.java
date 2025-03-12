package com.kood.match.Controller;

import com.kood.match.DTO.UserRequest;
import com.kood.match.DTO.UserWithStatuses;
import com.kood.match.Entity.User;
import com.kood.match.Service.UserService;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteByEmail(@RequestBody String email) {
        userService.deleteByEmail(email);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping
    public ResponseEntity<User> findByEmail(String email) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findUserByEmail(email));
    }

    @PatchMapping
    public ResponseEntity<User> updateUser(@RequestBody UserRequest request, @RequestBody String oldEmail) {
        User user = userService.updateUserByOldEmail(request, oldEmail);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<Map<String, String>> uploadPhoto(@PathVariable Long id, @NotNull @RequestParam("file") MultipartFile file) {
        String photoUrl = userService.uploadPhoto(id, file);
        return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
    }


    @PatchMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody User user) {
        userService.updateUserById(id, user);
        return ResponseEntity.ok("Profile successfully updated");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }

    //Gives user and checks if user and the client have any relationship and put them in the UserWithStatuses object
    @GetMapping("/{id}/status")
    public ResponseEntity<UserWithStatuses> getUserByIdAndStatus(@PathVariable Long id, @AuthenticationPrincipal String userEmail) {
        return ResponseEntity.ok(userService.findUserByIdWithStatus(id , userEmail));
    }

}
