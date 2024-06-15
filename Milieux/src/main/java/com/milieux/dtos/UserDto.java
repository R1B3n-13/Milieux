package com.milieux.dtos;

import java.util.List;

public class UserDto {

	private Integer id;
	private String firstName;
	private String lastName;
	private String email;
	private List<Integer> followers;
	private List<Integer> followings;

	public UserDto() {
	}

	public UserDto(Integer id, String firstName, String lastName, String email, List<Integer> followers,
			List<Integer> followings) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.followers = followers;
		this.followings = followings;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<Integer> getFollowers() {
		return followers;
	}

	public void setFollowers(List<Integer> followers) {
		this.followers = followers;
	}

	public List<Integer> getFollowings() {
		return followings;
	}

	public void setFollowings(List<Integer> followings) {
		this.followings = followings;
	}
}
