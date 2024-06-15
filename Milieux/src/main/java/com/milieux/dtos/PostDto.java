package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.milieux.models.Comment;
import com.milieux.models.User;

public class PostDto {

	private Integer id;
	private String caption;
	private String imagePath;
	private String videoPath;

	private List<User> likedByUsers = new ArrayList<>();
	private List<Comment> comments = new ArrayList<>();

	private ZonedDateTime createdAt;

	public PostDto() {
	}

	public PostDto(Integer id, String caption, String imagePath, String videoPath, List<User> likedByUsers,
			List<Comment> comments, ZonedDateTime createdAt) {
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

	public List<User> getLikedByUsers() {
		return likedByUsers;
	}

	public void setLikedByUsers(List<User> likedByUsers) {
		this.likedByUsers = likedByUsers;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

	public ZonedDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(ZonedDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
