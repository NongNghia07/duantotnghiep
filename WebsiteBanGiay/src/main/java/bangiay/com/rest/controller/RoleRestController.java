package bangiay.com.rest.controller;

import java.util.List;
import java.util.stream.Collectors;

import bangiay.com.DTO.PremissionDTO;
import bangiay.com.DTO.RoleDTO;
import bangiay.com.DTO.SizeDTO;
import bangiay.com.doMain.constant;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import bangiay.com.entity.Role;
import bangiay.com.service.RoleService;
import bangiay.com.service.impl.RoleServiceImpl;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/role")
public class RoleRestController {
	@Autowired
	ModelMapper modelMapper;
	
	@Autowired
	RoleService roleService;

	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/create")
	public Role create(@RequestBody RoleDTO role) {
		return roleService.create(role );
	}

	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/createAll")
	public List<Role> createAll(@RequestBody List<Role> role) {
		return roleService.createAll(role);
	}

	@PreAuthorize("hasPermission(#req, 'ROLE_VIEW') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/get/{id}")
	public Role get(@PathVariable Integer id) throws Exception {
		return roleService.findById(id);
	}

	@PreAuthorize("hasPermission(#req, 'ROLE_VIEW') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/get")
	public List<RoleDTO> getAll() {
		return roleService.findAll().stream().map(c -> modelMapper.map(c, RoleDTO.class)).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasPermission(#req, 'ROLE_VIEW') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/select")
	public ResponseEntity<Page<RoleDTO>> getPage(
			@RequestParam(name = constant.PAGE, defaultValue = constant.DEFAULT_PAGE) int page,
			@RequestParam(name = constant.SIZE, defaultValue = constant.DEFAULT_SIZE) int size
	) {
		Pageable pageable = PageRequest.of(page - 1 , size);
		return ResponseEntity.ok(roleService.findAll(pageable));
	}

	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PutMapping("/update/{id}")
	public RoleDTO update(@RequestBody RoleDTO role , @PathVariable Integer id) throws Exception {
		role.setId(id); 
		return roleService.update(role);
	}

	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/delete/{id}")
	public void deleteById(@PathVariable Integer id) {
		roleService.delete(id);
	}
	
	@PreAuthorize("hasPermission(#req, 'ROLE_VIEW') or hasPermission(#req, 'ADMIN')")
	@GetMapping("/getPermission")
	public List<PremissionDTO> getAllPermission() {
		return roleService.findAllPremission().stream().map(c -> modelMapper.map(c, PremissionDTO.class)).collect(Collectors.toList());
	}
	
	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/add/permission")
	public void addPermission(@RequestParam Integer roleId , @RequestParam Integer premissionId) throws Exception {
		roleService.addPermission(roleId, premissionId);
	}
	
	@PreAuthorize("hasPermission(#req, 'ROLE_EDIT') or hasPermission(#req, 'ADMIN')")
	@PostMapping("/deletePermission")
	public void deleteById(@RequestParam Integer roleId , @RequestParam Integer premissionId) throws Exception{
		roleService.deletePermission(roleId, premissionId);
	}
}
