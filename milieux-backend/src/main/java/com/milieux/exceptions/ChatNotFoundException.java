package com.milieux.exceptions;

public class ChatNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ChatNotFoundException() {
	}

	public ChatNotFoundException(String message) {
		super(message);
	}
}
