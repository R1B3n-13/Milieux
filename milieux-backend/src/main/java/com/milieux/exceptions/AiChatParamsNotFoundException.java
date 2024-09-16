package com.milieux.exceptions;

public class AiChatParamsNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AiChatParamsNotFoundException() {
	}

	public AiChatParamsNotFoundException(String message) {
		super(message);
	}
}
