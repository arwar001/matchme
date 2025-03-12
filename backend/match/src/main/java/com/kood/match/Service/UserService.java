package com.kood.match.Service;

import com.kood.match.DTO.UserRequest;
import com.kood.match.DTO.UserWithStatuses;
import com.kood.match.Entity.User;
import com.kood.match.Exceptions.EntityMalformed;
import com.kood.match.Exceptions.UserNotFoundException;
import com.kood.match.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import com.kood.match.Repository.CityRepository;
import com.kood.match.Repository.CountryRepository;
import com.kood.match.Entity.City;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;



    public User registerUser(UserRequest request) {
        GeometryFactory geometryFactory = new GeometryFactory();
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setAge(Integer.parseInt(request.getAge()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setGender(request.getGender());
        user.setCity(request.getCity());
        user.setCountry(request.getCountry());
        user.setPurpose(request.getPurpose());
        user.setAvatar(request.getAvatar());
        user.setEducation(request.getEducation());
        user.setProfession(request.getProfession());
        user.setHobby(request.getHobby());
        user.setLastOnline(new Date());
        //Find the city by name and set the location
        List<City> cityList = cityRepository.findByCountry(countryRepository.findByName(request.getCountry()).getCode());
        Point point = cityList.stream()
                .filter(city -> city.getName().equals(request.getCity()))
                .findFirst()
                .map(city -> {
                    Point p = geometryFactory.createPoint(new Coordinate(city.getLon(), city.getLat()));
                    p.setSRID(4326);
                    return p;
                })
                .orElseThrow(() -> new EntityMalformed("Country and city do not match"));

        user.setLocation(point);

        userRepository.save(user);
        return user;
    }

    ;

    public boolean validateUser(String email, String password) {
        User user = findUserByEmail(email);
        return passwordEncoder.matches(password, user.getPassword());
    }

    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        return user;
    }

    public User findUserById(Long userId) {
        User user = userRepository.findUserById(userId);
        if (user == null) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        return user;
    }

    public User updateUserByOldEmail(UserRequest user, String oldEmail) {
        User oldUser = findUserByEmail(oldEmail);

        if (user.getEmail() != null) {
            oldUser.setEmail(user.getEmail());
        }

        if (user.getPassword() != null) {
            oldUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (user.getUsername() != null) {
            oldUser.setUsername(user.getUsername());
        }

        if (user.getAge() != null) {
            oldUser.setAge(Integer.parseInt(user.getAge()));
        }

        if (user.getGender() != null) {
            oldUser.setGender(user.getGender());
        }

        if (user.getName() != null) {
            oldUser.setName(user.getName());
        }

        if (user.getSurname() != null) {
            oldUser.setSurname(user.getSurname());
        }

        if (user.getCountry() != null) {
            oldUser.setCountry(user.getCountry());
        }

        if (user.getCity() != null) {
            oldUser.setCity(user.getCity());
        }

        if (user.getPurpose() != null) {
            oldUser.setPurpose(user.getPurpose());
        }

        if (user.getAvatar() != null) {
            oldUser.setAvatar(user.getAvatar());
        }

        if (user.getEducation() != null) {
            oldUser.setEducation(user.getEducation());
        }

        if (user.getProfession() != null) {
            oldUser.setProfession(user.getProfession());
        }

        if (user.getHobby() != null) {
            oldUser.setHobby(user.getHobby());
        }

        return userRepository.save(oldUser);
    }


    public String sendFriendRequestOrAccept(String receiverEmail, String senderEmail) {
        User senderUser = findUserByEmail(senderEmail);
        User receiverUser = findUserByEmail(receiverEmail);
        Long senderId = senderUser.getId();
        Long receiverId = receiverUser.getId();
        if(userRepository.existsFriendship(senderId, receiverId)){
            return "Already friends";
        }
        //here I find from the request table if a request exists between these two users
        List<Object[]> request = userRepository.findSenderReceiver(senderId, receiverId);
        if (request.isEmpty()) {
            senderUser.getRequests().add(receiverUser);
            userRepository.save(senderUser);
            return "New friend request sent";
        }
        Object[] requestObjectArray = request.getFirst();
        Long lastSenderId = ((Number) requestObjectArray[0]).longValue();
        if (lastSenderId.equals(senderId)) {
            return "Friend request already sent";
        }
        //remove the request from the table and add the users to each other's friend list
        receiverUser.getFriends().add(senderUser);
        receiverUser.getRequests().remove(senderUser);
        senderUser.getFriends().add(receiverUser);
        senderUser.getRequests().remove(receiverUser);
        userRepository.save(senderUser);
        chatRoomService.createChatRoom(senderId, receiverId);
        return "Friend request accepted";
    }

    public List<User> getAllFriends(String email){
        User user = findUserByEmail(email);
        return userRepository.findFriendsByUserId(user.getId());
    }

    public List<User> getAllRequests(String email){
        User user = findUserByEmail(email);
        return userRepository.findIncomingRequestsByUserId(user.getId());
    }

    public String uploadPhoto(Long id, MultipartFile file) {

        User user = findUserById(id);

        if (file.isEmpty()) {
            throw new RuntimeException("File not chosen");
        }

        try {
            String fileExtension = getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
            if (fileExtension == null) {
                throw new RuntimeException("Invalid file format");
            }

            String filePathName ="uploads/"+ id + "_photo." + fileExtension;

            Path path = Paths.get(filePathName);
            Files.createDirectories(path.getParent());
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            user.setAvatar(filePathName);
            userRepository.save(user);

            return filePathName;

        } catch (IOException e) {
            throw new RuntimeException("Error while uploading a photo", e);
        }
    }

    public void updateUserById(Long id, User userData) {
        User user = findUserById(id);

        user.setPurpose(userData.getPurpose());
        user.setAge(userData.getAge());
        user.setGender(userData.getGender());
        user.setCountry(userData.getCountry());
        user.setCity(userData.getCity());
        user.setEducation(userData.getEducation());
        user.setProfession(userData.getProfession());
        user.setExtraInfo(userData.getExtraInfo());

        userRepository.save(user);
    }

    private String getFileExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index == -1) {
            return null;
        }

        return fileName.substring(index + 1);
    }

    public void setUserOnline(String userId) {
        User user = userRepository.findUserById(Long.valueOf(userId));
        user.setOnline(true);
        userRepository.save(user);
        updateUserForFriends(user.getId(), user, "/friends");
    }

    public void setUserOffline(String userId) {
        User user = userRepository.findUserById(Long.valueOf(userId));
        user.setOnline(false);
        user.setLastOnline(new Date());
        userRepository.save(user);
        updateUserForFriends(user.getId(), user, "/friends");
    }

    public void updateUserForFriends(Long userId, Object obj, String path) {
        List<User> friends = userRepository.findFriendsByUserId(userId);
        friends.forEach(friend -> {
            messagingTemplate.convertAndSendToUser(friend.getEmail(), "/queue"+path, obj);
        });
    }

    public void deleteIfRequestExists(Long friendId, String clientEmail) {
        User client = findUserByEmail(clientEmail);
        userRepository.deleteIfRequestExists(client.getId(), friendId);
    }

    public void removeFriend(Long friendId, String clientEmail) {
        User client = findUserByEmail(clientEmail);
        User friend = findUserById(friendId);
        client.getFriends().remove(friend);
        friend.getFriends().remove(client);
        userRepository.save(client);
        Map <String, Long> deleteRequest = Map.of("deleteid", client.getId());
        updateUserForFriends(client.getId(), deleteRequest, "/friends");
    }

    public UserWithStatuses findUserByIdWithStatus(Long id, String clientEmail) {
        User user = findUserById(id);
        User client = findUserByEmail(clientEmail);

        boolean isFriend = userRepository.existsFriendship(user.getId(), client.getId());
        boolean clientSentRequestToUser = userRepository.existsFriendRequest(client.getId(), user.getId());
        boolean userSentRequestToClient = userRepository.existsFriendRequest(user.getId(), client.getId());

        return new UserWithStatuses(user, isFriend, clientSentRequestToUser, userSentRequestToClient);
    }
}
