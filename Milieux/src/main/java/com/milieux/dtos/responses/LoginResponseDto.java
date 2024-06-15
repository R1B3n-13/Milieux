package com.milieux.dtos.responses;

public class LoginResponseDto extends BaseResponseDto {

	private String token;

	public LoginResponseDto() {
		super();
	}

	public LoginResponseDto(int statusCode, boolean success, String message, String token) {
		super(statusCode, success, message);
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
}
