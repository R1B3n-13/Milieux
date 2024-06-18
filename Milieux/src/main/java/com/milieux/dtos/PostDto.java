package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostDto {

	private Integer id;
	private String caption;
	private String imagePath;
	private String videoPath;

	private List<UserDto> likedByUsers = new ArrayList<>();
	private List<CommentDto> comments = new ArrayList<>();

	private ZonedDateTime createdAt;

	public PostDto() {
	}

	public PostDto(Integer id, String caption, String imagePath, String videoPath, List<UserDto> likedByUsers,
			List<CommentDto> comments, ZonedDateTime createdAt) {
		super();
		this.id = id;
		this.caption = caption;
		this.imagePath = imagePath;
		this.videoPath = videoPath;
		this.likedByUsers = likedByUsers;
		this.comments = comments;
		this.createdAt = createdAt;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public List<UserDto> getLikedByUsers() {
		return likedByUsers;
	}

	public void setLikedByUsers(List<UserDto> likedByUsers) {
		this.likedByUsers = likedByUsers;
	}

	public List<CommentDto> getComments() {
		return comments;
	}

	public void setComments(List<CommentDto> comments) {
		this.comments = comments;
	}

	public ZonedDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(ZonedDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
