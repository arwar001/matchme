package com.kood.match.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kood.match.DTO.UserRequest;
import com.kood.match.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

import com.kood.match.Entity.City;
import com.kood.match.Entity.Country;
import com.kood.match.Repository.CityRepository;
import com.kood.match.Repository.CountryRepository;

@Service
public class DataLoader {

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final UserRepository userRepository;
    private final UserService userService;

    public DataLoader(CityRepository cityRepository, CountryRepository countryRepository, UserRepository userRepository, UserService userService) {
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostConstruct // Runs on startup
    public void loadCountriesIfEmpty() {
        if (cityRepository.count() == 0) { // Only insert if empty
            try {
                InputStream inputStream = new ClassPathResource("cities500.json").getInputStream();
                List<City> cities = objectMapper.readValue(inputStream, new TypeReference<List<City>>() {
                });
                cityRepository.saveAll(cities);
                System.out.println("✅ Cities loaded into database!");
            } catch (Exception e) {
                System.err.println("❌ Error loading cities: " + e.getMessage());
            }
        } else {
            System.out.println("✅ Cities already exist in database, skipping JSON import.");
        }
        if (countryRepository.count() == 0) { // Only insert if empty
            try {
                InputStream inputStream = new ClassPathResource("countries.json").getInputStream();
                List<Country> countries = objectMapper.readValue(inputStream, new TypeReference<List<Country>>() {
                });
                countryRepository.saveAll(countries);
                System.out.println("✅ Countries loaded into database!");
            } catch (Exception e) {
                System.err.println("❌ Error loading countries: " + e.getMessage());
            }
        } else {
            System.out.println("✅ Countries already exist in database, skipping JSON import.");
        }
        if (userRepository.count() == 0) {
            try {
                InputStream inputStream = new ClassPathResource("users.json").getInputStream();
                List<UserRequest> users = objectMapper.readValue(inputStream, new TypeReference<List<UserRequest>>() {
                });
                for (UserRequest user : users) {
                    userService.registerUser(user);
                }
                System.out.println("✅ Users loaded into database!");
            } catch (Exception e) {
                System.err.println("❌ Error loading users: " + e.getMessage());
            }
        } else {
            System.out.println("✅ Users already exist in database, skipping JSON import.");
        }
    }
}

