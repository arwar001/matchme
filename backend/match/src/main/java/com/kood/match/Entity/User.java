package com.kood.match.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Point;
import lombok.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @NotBlank
    @Column(unique = true)
    @Pattern(regexp = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$",
            message = "Invalid email")
    private String email;
    @NotBlank
    @Column(unique = true)
    private String username;
    @NotBlank
    @JsonIgnore
    private String password;
    @NotBlank
    private String name;
    @NotBlank
    private String surname;
    @NotNull
    private Integer age;
    @NotBlank
    private String gender;
    @NotBlank
    private String country;
    @NotBlank
    private String city;
    @NotBlank
    private String purpose;
    @JsonIgnore
    @NotNull
    @JdbcTypeCode(SqlTypes.GEOGRAPHY)
    private Point location;
    @NotNull
    private Date lastOnline;
    @Column(columnDefinition = "boolean default false")
    private boolean online;
    private String avatar;
    private String education;
    private String profession;
    private String hobby;
    private String extraInfo;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id"))
    private Set<User> friends = new HashSet<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "requests",
            joinColumns = @JoinColumn(name = "sender_id"),
            inverseJoinColumns = @JoinColumn(name = "receiver_id"))
    private Set<User> requests = new HashSet<>();

}
