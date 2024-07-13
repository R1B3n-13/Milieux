package com.milieux.dtos.requests;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

	private Boolean isBusiness;
	
	private String name;
	private String email;
	private String password;
	
	private String dp;
	private String banner;
	
	private String status;
	private String intro;
	private String address;
	
	private Map<String, Object> userType;
}
