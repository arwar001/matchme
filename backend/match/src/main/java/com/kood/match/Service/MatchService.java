package com.kood.match.Service;


import com.kood.match.DTO.FilterMatch;
import com.kood.match.Entity.User;
import com.kood.match.Repository.UserRepository;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MatchService {

    private final UserRepository userRepository;

    public MatchService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getMatchFromFilter(FilterMatch filter, String email) {
        User user = userRepository.findByEmail(email);
        String purpose = filter.getPurpose();
        String gender = !Objects.equals(filter.getGender(), "all") ? filter.getGender() : null;
        Integer minAge = !Objects.equals(filter.getMinAge(), "") ? Integer.parseInt(filter.getMinAge()) : null;
        Integer maxAge = !Objects.equals(filter.getMaxAge(), "") ? Integer.parseInt(filter.getMaxAge()) : null;
        String country = null;
        Point center = null;
        Double radius = null;
        List<Long> blacklist = new ArrayList<>();
        blacklist.add(user.getId());
        blacklist.addAll(userRepository.findFriendsByUserId(user.getId()).stream().map(User::getId).toList());
        blacklist.addAll(userRepository.findOutgoingRequestsByUserId(user.getId()).stream().map(User::getId).toList());
        if (Objects.equals(filter.getLocation(), "radius")){
            center = user.getLocation();
        radius =1000 * Double.parseDouble(filter.getRadius());
        } else if (Objects.equals(filter.getLocation(), "country")){
            country = filter.getCountry();
        }


        return userRepository.searchUsers(purpose, gender, minAge, maxAge, country, center, radius, blacklist);
    }

}
