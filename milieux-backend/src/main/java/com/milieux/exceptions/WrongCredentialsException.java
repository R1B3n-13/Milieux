package com.milieux.exceptions;

public class WrongCredentialsException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public WrongCredentialsException() {
	}

	public WrongCredentialsException(String message) {
		super(message);
	}
}
