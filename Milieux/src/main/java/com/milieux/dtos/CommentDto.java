package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.milieux.models.User;

public class CommentDto {

	private Integer id;
	private String text;
	private String imagePath;

	private List<User> likedByUsers = new ArrayList<>();
	private ZonedDateTime createdAt;

	public CommentDto() {
	}

	public CommentDto(Integer id, String text, String imagePath, List<User> likedByUsers, ZonedDateTime createdAt) {
		super();
		this.id = id;
		this.text = text;
		this.imagePath = imagePath;
		this.likedByUsers = likedByUsers;
		this.createdAt = createdAt;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
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

	public List<User> getLikedByUsers() {
		return likedByUsers;
	}

	public void setLikedByUsers(List<User> likedByUsers) {
		this.likedByUsers = likedByUsers;
	}

	public ZonedDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(ZonedDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
