package com.milieux.exceptions;

public class CommentNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CommentNotFoundException() {
	}

	public CommentNotFoundException(String message) {
		super(message);
	}
}
