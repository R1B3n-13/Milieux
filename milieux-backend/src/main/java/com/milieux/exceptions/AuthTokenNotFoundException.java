package com.milieux.exceptions;

public class AuthTokenNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AuthTokenNotFoundException() {
	}

	public AuthTokenNotFoundException(String message) {
		super(message);
	}
}
