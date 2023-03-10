package bangiay.com.rest.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import bangiay.com.DTO.BillDTO;
import bangiay.com.doMain.constant;
import bangiay.com.service.BillService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(value = "bill")
public class BillRestController {
	@Autowired
	private BillService billService;
	@Autowired
	private ModelMapper modelMapper;

//	private static Logger logger = LoggerFactory.getLogger(BillController.class);

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/getAll")
	public ResponseEntity<List<BillDTO>> getAll() {
		return ResponseEntity.ok().body(billService.findAll());
	}

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/select")
	public ResponseEntity<Page<BillDTO>> getPage(
			@RequestParam(name = constant.PAGE, defaultValue = constant.DEFAULT_PAGE) int page,
			@RequestParam(name = constant.SIZE, defaultValue = constant.DEFAULT_SIZE) int size) {
		Pageable pageable = PageRequest.of(page - 1, size);
		return ResponseEntity.ok(billService.findAll(pageable));
	}

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/getOneById")
	@CrossOrigin
	public ResponseEntity<BillDTO> getOneById(@RequestParam("id") Integer id) {
		BillDTO billDTO = billService.findByID(id);
		BillDTO responBillDTO = modelMapper.map(billDTO, BillDTO.class);
		return ResponseEntity.ok().body(responBillDTO);
	}

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping(value = "/update")
	public ResponseEntity<BillDTO> update(@RequestParam(name = "id") Integer id, @RequestBody BillDTO billDTO) {
		billDTO.setId(id);
		return ResponseEntity.ok().body(billService.updateBill(billDTO));
	}

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping(value = "/create/{user_IdOrTelephone}")
	public ResponseEntity<BillDTO> create(@PathVariable("user_IdOrTelephone") Integer user_IdOrTelephone) {
		return ResponseEntity.ok().body(billService.createBill(user_IdOrTelephone));
	}

	@PreAuthorize("hasPermission(#req, 'USER_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping(value = "/delete")
	public ResponseEntity<String> delete(@RequestParam(name = "id") Integer id) {
//		logger.info("Deleted bill with id : " + id);
		billService.deleteById(id);
		return ResponseEntity.ok().body("Delete bill id " + id + " successfully!");
	}
}
