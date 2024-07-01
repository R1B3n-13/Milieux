package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

	private Long id;
	
	private Boolean isBusiness;
	
	private String name;
	private String email;
	
	private Map<String, String> userType;

	private List<Long> followers;
	private List<Long> followings;

	private ZonedDateTime createdAt;
}
