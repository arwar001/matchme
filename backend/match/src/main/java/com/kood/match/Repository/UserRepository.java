package com.kood.match.Repository;

import com.kood.match.Entity.User;
import jakarta.transaction.Transactional;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    void deleteByEmail(String email);

    @Transactional
    @Modifying
    @Query(value = """
            DELETE FROM requests r
            WHERE (r.sender_id = :senderId AND r.receiver_id = :receiverId)
               OR (r.sender_id = :receiverId AND r.receiver_id = :senderId)
    """, nativeQuery = true)
    void deleteIfRequestExists(@Param("senderId") Long senderId,@Param("receiverId") Long ReceiverId);

    User findByEmail(String email);
    User findUserById(Long userId);
    List<User> findAllByOnline(boolean Online);

    @Query(value = """
            SELECT * FROM users u
            WHERE u.purpose = :purpose
              AND (:gender IS NULL OR u.gender = :gender)
              AND (:minAge IS NULL OR u.age >= :minAge)
              AND (:maxAge IS NULL OR u.age <= :maxAge)
              AND (:country IS NULL OR u.country = :country)
              AND (:radius IS NULL OR ST_DWithin(u.location, :center, :radius))
              AND (u.id NOT IN (:blacklist))
            """, nativeQuery = true)
    List<User> searchUsers(
            @Param("purpose") String purpose,
            @Param("gender") String gender,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("country") String country,
            @Param("center") Point center,
            @Param("radius") Double radius,
            @Param("blacklist") List<Long> blacklist
    );

    @Query(value = """
                SELECT r.sender_id, r.receiver_id FROM requests r
                WHERE (r.sender_id = :user1id AND r.receiver_id = :user2id)
                   OR (r.sender_id = :user2id AND r.receiver_id = :user1id)
            """, nativeQuery = true)
    List<Object[]> findSenderReceiver(@Param("user1id") Long user1id, @Param("user2id") Long user2id);

    @Query(value = """
            SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
            FROM friends r
            WHERE (r.user_id = :user1id AND r.friend_id = :user2id)
               OR (r.user_id = :user2id AND r.friend_id = :user1id)
            """, nativeQuery = true)
    boolean existsFriendship(@Param("user1id") Long user1id, @Param("user2id") Long user2id);

    @Query(value = """
    SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END
    FROM requests r
    WHERE (r.sender_id = :senderId AND r.receiver_id = :receiverId)
    """, nativeQuery = true)
    boolean existsFriendRequest(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);


    @Query("SELECT f FROM User u JOIN u.friends f WHERE u.id = :userId")
    List<User> findFriendsByUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT * FROM users u
            WHERE u.id IN (
                 SELECT r.sender_id
                 FROM requests r
                 WHERE r.receiver_id = :userId
             );
            """, nativeQuery = true)
    List<User> findIncomingRequestsByUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT * FROM users u
            WHERE u.id IN (
                 SELECT r.receiver_id
                 FROM requests r
                 WHERE r.sender_id = :userId
             );
            """, nativeQuery = true)
    List<User> findOutgoingRequestsByUserId(@Param("userId")Long userId);
}
