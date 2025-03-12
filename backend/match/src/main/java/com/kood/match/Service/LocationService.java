package com.kood.match.Service;

import com.kood.match.Entity.Country;
import com.kood.match.Repository.CityRepository;
import com.kood.match.Repository.CountryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LocationService {

    private final CountryRepository countryRepository;
    private final CityRepository cityRepository;

    public LocationService(CountryRepository countryRepository, CityRepository cityRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }

    public List<String> getCountryArray() {
        List<Country> countries = countryRepository.findAll();
        List<String> countryArray = new ArrayList<String>();
        countries.forEach(country -> {
            countryArray.add(country.getName());
        });
        return countryArray;
    }

    public List<String> getCitiesArrayByCountry(String country) {
        String code = countryRepository.findByName(country).getCode();
        List<String> citiesArray = new ArrayList<String>();
        cityRepository.findByCountry(code).forEach(city -> {
            if (!citiesArray.contains(city.getName())) {
                citiesArray.add(city.getName());
            }
            ;
        });
        return citiesArray;
    }
}
