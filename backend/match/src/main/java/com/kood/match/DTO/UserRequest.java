package com.kood.match.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserRequest {

    private String username;
    @NotBlank
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*\\(\\)_\\+\\-=\\[\\]\\{\\};:,.<>?\\/]).{8,}$\n")
    private String password;
    private String email;
    private String name;
    private String surname;
    private String age;
    private String gender;
    private String country;
    private String city;
    private String purpose;
    private String avatar;
    private String education;
    private String profession;
    private String hobby;
}
