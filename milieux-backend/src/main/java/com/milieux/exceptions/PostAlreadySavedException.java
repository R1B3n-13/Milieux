package com.milieux.exceptions;

public class PostAlreadySavedException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public PostAlreadySavedException() {
	}

	public PostAlreadySavedException(String message) {
		super(message);
	}
}
