package bangiay.com.rest.controller;


import java.util.List;

import bangiay.com.DTO.MediaDTO;
import bangiay.com.DTO.RoleDTO;
import bangiay.com.doMain.constant;
import bangiay.com.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import bangiay.com.service.impl.MediaServiceImpl;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/media")
public class MediaRestController {
	@Autowired
	private MediaServiceImpl mediaServiceImpl;

	@Autowired
	private MediaService mediaService;
	@GetMapping("/findAll")
	public List<MediaDTO> findAll() {
		return mediaServiceImpl.findAll();
	}
	@GetMapping("/select")
	public ResponseEntity<Page<MediaDTO>> getPage(
			@RequestParam(name = constant.PAGE, defaultValue = constant.DEFAULT_PAGE) int page,
			@RequestParam(name = constant.SIZE, defaultValue = constant.DEFAULT_SIZE) int size
	) {
		Pageable pageable = PageRequest.of(page - 1 , size);
		return ResponseEntity.ok(mediaService.findAll(pageable));
	}
	@GetMapping("/findById/{id}")
	public MediaDTO findById(@PathVariable Integer id) {
		return mediaServiceImpl.findById(id);
	}

	@PostMapping("/create")
	public List<MediaDTO> create(@RequestBody List<MediaDTO> mediaDTO) {
		return mediaServiceImpl.createAll(mediaDTO);
	}

	@PutMapping("/update")
	public MediaDTO update(@RequestBody MediaDTO mediaDTO) {
		return mediaServiceImpl.update(mediaDTO);
	}

	@DeleteMapping("/update")
	public void update(@PathVariable Integer id) {
		mediaServiceImpl.delete(id);
	}

}
