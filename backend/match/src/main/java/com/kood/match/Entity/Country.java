package com.kood.match.Entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "countries")
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String code;


}
