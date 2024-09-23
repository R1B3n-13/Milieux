package com.milieux.exceptions;

public class AiToolNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AiToolNotFoundException() {
	}

	public AiToolNotFoundException(String message) {
		super(message);
	}
}
