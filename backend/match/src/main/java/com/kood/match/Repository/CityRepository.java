package com.kood.match.Repository;

import com.kood.match.Entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    List<City> findByCountry(String country);

    @Query("SELECT c.lat FROM City c WHERE c.name = :name")
    Double findLatByName(@Param("name") String name);

    @Query("SELECT c.lon FROM City c WHERE c.name = :name")
    Double findLonByName(@Param("name") String name);
}

