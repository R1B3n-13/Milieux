package com.milieux.exceptions;

public class UserNotAuthorizedException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public UserNotAuthorizedException(String message) {
		super(message);
	}
}
