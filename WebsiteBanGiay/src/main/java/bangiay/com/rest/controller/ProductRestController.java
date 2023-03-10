package bangiay.com.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bangiay.com.DTO.ColorDTO;
import bangiay.com.DTO.ProductDTO;
import bangiay.com.service.ProductService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("admin/product")
public class ProductRestController {

	@Autowired
	ProductService productService;

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@GetMapping("/index")
	public List<ProductDTO> findAll() {
		return productService.findAll();
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@GetMapping("/select")
	public Page<ProductDTO> findAll(@RequestParam(name = "size", defaultValue = "7") Integer size,
			@RequestParam(name = "page", defaultValue = "0") Integer page) {
		return productService.findAll(size, page);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_EDIT') or hasPermission(#req, 'ADMIN')")
	@DeleteMapping("/delete/{id}")
	public void delete(@PathVariable("id") int id) {
		productService.delete(id);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/post")
	public ProductDTO post(@RequestBody ProductDTO productDTO) {
		return productService.create(productDTO);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_EDIT') or hasPermission(#req, 'ADMIN')")
	@PutMapping("/put/{id}")
	public ProductDTO put(@PathVariable("id") Integer id, @RequestBody ProductDTO productDTO) {
		productDTO.setId(id);
		return productService.update(productDTO);
	}

	@PreAuthorize("hasPermission(#req, 'CUSTOMER') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/find/{id}")
	public ProductDTO finByID(@RequestBody @PathVariable("id") int id, ProductDTO productDTO) {
		return productService.finById(id);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/search")
	public Page<ProductDTO> search(@RequestParam(name = "size", defaultValue = "7") Integer size,
			@RequestParam(name = "page", defaultValue = "0") Integer page,
			@RequestParam(name = "keyword", defaultValue = "") String keyword) {
		return productService.searchByKeyword(size, page, keyword);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/updateStatusFalse")
	public void updateStatusFalse(@RequestBody ColorDTO colordto) {
		productService.updateStatusFalse(colordto);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_EDIT') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@PostMapping("/searchClient")
	public Page<ProductDTO> searchClient(@RequestParam(name = "size", defaultValue = "11") Integer size,
			@RequestParam(name = "page", defaultValue = "0") Integer page,
			@RequestParam(name = "cate_Id", defaultValue = "0") Integer cate_Id,
			@RequestParam(name = "keyword", defaultValue = "") String keyword) {
		return productService.searchByKeywordAndCate_Id(size, page, keyword, cate_Id);
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@GetMapping("/findTop5New")
	public List<ProductDTO> findTop5New() {
		return this.productService.top5NewProduct();
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@GetMapping("/findTop3Bill")
	public List<ProductDTO> findTop3Bill() {
		return this.productService.top3BillProduct();
	}

	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@PostMapping("/findByName")
	public ProductDTO findByName(@RequestBody ColorDTO colordto) {
		return this.productService.findByName(colordto);
	}
	
	@PreAuthorize("hasPermission(#req, 'PRODUCT_VIEW') or hasPermission(#req, 'ADMIN') or hasPermission(#req, 'CUSTOMER')")
	@PostMapping("/findByNameAndColor")
	public ProductDTO findByColorAndName(@RequestBody ColorDTO colordto) {
		return this.productService.findByColorAndName(colordto);
	}
}
