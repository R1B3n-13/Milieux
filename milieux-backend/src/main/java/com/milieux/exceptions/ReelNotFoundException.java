package com.milieux.exceptions;

public class ReelNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ReelNotFoundException() {
	}

	public ReelNotFoundException(String message) {
		super(message);
	}
}
