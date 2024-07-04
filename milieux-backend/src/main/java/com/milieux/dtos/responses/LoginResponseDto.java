package com.milieux.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto extends BaseResponseDto {

	private String token;

	public LoginResponseDto(int status, boolean success, String message, String token) {
		super(status, success, message);
		this.token = token;
	}
}
