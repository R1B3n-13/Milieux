package com.milieux.exceptions;

public class AuthenticationFailedException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AuthenticationFailedException() {
	}

	public AuthenticationFailedException(String message) {
		super(message);
	}
}
