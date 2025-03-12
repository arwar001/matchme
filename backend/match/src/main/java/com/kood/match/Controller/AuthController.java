package com.kood.match.Controller;


import com.kood.match.DTO.UserRequest;
import com.kood.match.Entity.User;
import com.kood.match.Exceptions.UserNotFoundException;
import com.kood.match.Service.JwtService;
import com.kood.match.Service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;
    private final UserService userService;

    public AuthController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody UserRequest request, HttpServletResponse response) {
        String email = request.getEmail();
        String password = request.getPassword();
        if (userService.validateUser(email, password)) {
            String token = jwtService.generateToken(email);

            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 10); // 10 hour
            response.addCookie(cookie);
            return ResponseEntity.status(HttpStatus.OK).body(userService.findUserByEmail(email));
        } else {
            throw new UserNotFoundException("Wrong Password");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.status(HttpStatus.OK).body("Logout successful");
    }

    @GetMapping("/check")
    public ResponseEntity<User> checkUser(@AuthenticationPrincipal String email) {
        System.out.println("Checking user");
        User user = userService.findUserByEmail(email);
        return ResponseEntity.status(HttpStatus.OK).body(user);

    }
}
