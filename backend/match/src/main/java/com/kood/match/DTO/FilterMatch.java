package com.kood.match.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class FilterMatch {
    private String gender;
    @Pattern(regexp = "^\\d{2}$")
    private String minAge;
    @Pattern(regexp = "^\\d{2}$")
    private String maxAge;
    @NotNull
    private String purpose;
    private String country;
    private String city;
    private String radius;
    private String location;
}
