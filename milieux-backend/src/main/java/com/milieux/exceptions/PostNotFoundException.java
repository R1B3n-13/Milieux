package com.milieux.exceptions;

public class PostNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public PostNotFoundException() {
	}

	public PostNotFoundException(String message) {
		super(message);
	}
}
