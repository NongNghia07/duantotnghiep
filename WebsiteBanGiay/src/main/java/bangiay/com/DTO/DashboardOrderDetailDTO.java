package bangiay.com.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardOrderDetailDTO {
	private Integer id = 0;
	private String name;
	private Integer quantity = 0;
	private Double revenue;
	private String image = "";
}