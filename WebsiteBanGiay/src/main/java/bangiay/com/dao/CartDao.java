package bangiay.com.dao;

import bangiay.com.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartDao extends JpaRepository<Cart, Integer> {

}
