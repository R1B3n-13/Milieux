package com.milieux.dtos.responses;

import java.util.List;

import com.milieux.dtos.UserDto;

public class UserListResponseDto extends BaseResponseDto {

	private List<UserDto> users;

	public UserListResponseDto() {
	}

	public UserListResponseDto(int statusCode, boolean success, String message, List<UserDto> users) {
		super(statusCode, success, message);
		this.users = users;
	}

	public List<UserDto> getUsers() {
		return users;
	}

	public void setUsers(List<UserDto> users) {
		this.users = users;
	}
}
