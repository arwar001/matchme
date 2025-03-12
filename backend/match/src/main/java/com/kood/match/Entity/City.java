package com.kood.match.Entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "cities")
public class City {

    @Id
    private Long id;
    private String name;
    private String country;
    private String admin1;
    private Double lat;
    private Double lon;
    private String pop;

}
