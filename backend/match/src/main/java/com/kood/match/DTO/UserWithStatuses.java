package com.kood.match.DTO;

import com.kood.match.Entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class UserWithStatuses {
    private long id;
    private String email;
    private String username;
    private String name;
    private String surname;
    private Integer age;
    private String gender;
    private String country;
    private String city;
    private String purpose;
    private boolean online;
    private Date lastOnline;
    private String avatar;
    private String education;
    private String profession;
    private String hobby;
    private String extraInfo;

    private boolean friend;
    private boolean clientSentRequestToUser;
    private boolean userSentRequestToClient;

    public UserWithStatuses(User user, boolean isFriend, boolean clientSentRequestToUser, boolean userSentRequestToClient) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.age = user.getAge();
        this.gender = user.getGender();
        this.country = user.getCountry();
        this.city = user.getCity();
        this.purpose = user.getPurpose();
        this.online = user.isOnline();
        this.lastOnline = user.getLastOnline();
        this.avatar = user.getAvatar();
        this.education = user.getEducation();
        this.profession = user.getProfession();
        this.hobby = user.getHobby();
        this.extraInfo = user.getExtraInfo();

        this.friend = isFriend;
        this.clientSentRequestToUser = clientSentRequestToUser;
        this.userSentRequestToClient = userSentRequestToClient;
    }



}
