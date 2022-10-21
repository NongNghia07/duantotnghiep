package bangiay.com.service;

import java.util.List;
import bangiay.com.DTO.ProductDTO;
import bangiay.com.entity.Product;

public interface ProductService {
	public List<ProductDTO> findAll();
	
	public ProductDTO save(ProductDTO productDTO);
	
	public ProductDTO finById(long id);
	
	public void delete(long id);
}
