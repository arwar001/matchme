package com.kood.match.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {
    @Id
    @NotBlank
    private String chatRoomId;
    @NotNull
    private long userId1;
    @NotNull
    private long userId2;
    @NotNull
    private Date lastUser1ReadDate;
    @NotNull
    private Date lastUser2ReadDate;

}