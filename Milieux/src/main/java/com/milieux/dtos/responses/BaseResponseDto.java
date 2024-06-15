package com.milieux.dtos.responses;

public class BaseResponseDto {

	private int statusCode;
	private boolean success;
	private String message;

	public BaseResponseDto() {
	}

	public BaseResponseDto(int statusCode, boolean success, String message) {
		super();
		this.statusCode = statusCode;
		this.success = success;
		this.message = message;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(int statusCode) {
		this.statusCode = statusCode;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}
}
