package com.kood.match.Controller;

import com.kood.match.Service.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getAllLocations() {
        return ResponseEntity.status(HttpStatus.OK).body(locationService.getCountryArray());
    }

    @GetMapping("/{country}")
    public ResponseEntity<List<String>> getCitiesByCountry(@PathVariable String country) {
        return ResponseEntity.status(HttpStatus.OK).body(locationService.getCitiesArrayByCountry(country));
    }
}
