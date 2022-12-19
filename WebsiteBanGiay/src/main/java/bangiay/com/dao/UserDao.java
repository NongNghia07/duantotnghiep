package bangiay.com.dao;

import java.util.List;
import java.util.Optional;

import bangiay.com.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;



@Repository

public interface UserDao extends JpaRepository<User, Integer> {
	@Query("SELECT u FROM User u WHERE u.email LIKE :email OR u.telephone LIKE :telephone")
	List<User> findUserByEmailOrTelePhone(@Param("email") String email, @Param("telephone") String telephone);
//    User findByEmailOrtelephone(String emailOrtelephone);

	// List<User> getUserByRole(Role role);

	@Query("SELECT u FROM User u WHERE u.status =1")
	Page<User> getPageWhereStatus(Pageable pageable);

	@Query("SELECT n FROM User n where n.email = :email")
	List<User> findByname(@Param("email") String email);

//	Optional<User> findByEmail(String email);
//	Optional<User> findByResetToken(String reset_token);

}