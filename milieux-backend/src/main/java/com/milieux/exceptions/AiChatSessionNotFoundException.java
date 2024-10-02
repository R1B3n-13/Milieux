package com.milieux.exceptions;

public class AiChatSessionNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AiChatSessionNotFoundException() {
	}

	public AiChatSessionNotFoundException(String message) {
		super(message);
	}
}
