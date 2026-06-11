package com.example.shopmohinh.repository;

import com.example.shopmohinh.dto.search.UserSearch;
import com.example.shopmohinh.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByCode(String code);

    Optional<User> findByUsername(String username);

    @Query("""
            select u from User u
            """)
    List<User> findAll();

    @Query("""
            select u from User u
            """)
    List<User> getAll();

    // Paginated version of getAll (returns a Page)
    @Query("""
            select u from User u where (:#{#request.keyword} is null or u.username like %:#{#request.keyword}%)
            """)
    Page<User> getAll(@Param("request") UserSearch request, Pageable pageable);

    Optional<User> findByCode(String code);

    @Query(value = """
            select * from user order by user.id desc limit 1
            """, nativeQuery = true)
    User getTop1();

    Optional<User> findByEmail(String email);
}
