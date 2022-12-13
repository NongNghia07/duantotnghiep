package bangiay.com.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User {
	@Id
	@Column(name = "ID")
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "ROLER_ID")
	private Role role;

	@Column(name = "FullNAME")
	private String fullName;

	@Column(name = "PASSWORD")
	private String password;

	@Column(name = "EMAIL")
	private String email;

	@Column(name = "TELEPHONE")
	private String telephone;

	@Column(name = "ADDRESS")
	private String address;

	@Column(name = "CREATED")
	private java.sql.Timestamp created;

	@Column(name = "CREATOR")
	private String creator;

	@Column(name = "MODIFIED")
	private java.sql.Timestamp modified;

	@Column(name = "MODIFIER")
	private String modifier;

	@Column(name = "STATUS")
	private Integer status;

	@OneToMany(mappedBy = "USER_ID", cascade = CascadeType.ALL)
	private List<Bill> billList;

//    @OneToMany(mappedBy = "USER_ID", cascade = CascadeType.ALL)
//    private List<Bill> billList;
//    @OneToMany(mappedBy = "USER_ID", cascade = CascadeType.ALL)
//    private List<Cart> cartList;

}
