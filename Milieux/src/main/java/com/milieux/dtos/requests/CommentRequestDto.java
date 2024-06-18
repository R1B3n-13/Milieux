package com.milieux.dtos.requests;

public class CommentRequestDto {

	private String text;
	private String imagePath;

	public CommentRequestDto() {
	}

	public CommentRequestDto(String text, String imagePath) {
		super();
		this.text = text;
		this.imagePath = imagePath;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
}
