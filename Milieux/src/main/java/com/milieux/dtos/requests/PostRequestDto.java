package com.milieux.dtos.requests;

public class PostRequestDto {

	private String caption;
	private String imagePath;
	private String videoPath;

	public PostRequestDto() {
	}

	public PostRequestDto(String caption, String imagePath, String videoPath) {
		super();
		this.caption = caption;
		this.imagePath = imagePath;
		this.videoPath = videoPath;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getVideoPath() {
		return videoPath;
	}

	public void setVideoPath(String videoPath) {
		this.videoPath = videoPath;
	}
}
