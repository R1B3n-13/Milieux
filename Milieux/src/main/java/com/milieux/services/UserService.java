package com.milieux.services;

import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.UserListResponseDto;
import com.milieux.dtos.responses.UserResponseDto;

public interface UserService {

	public UserListResponseDto getAllUsers();

	public UserResponseDto getUserById(Integer userId);

	public UserResponseDto getUserByEmail(String email);

	public UserResponseDto getUserFromAuthHeader(String header);

	public UserListResponseDto searchUsers(String query);

	public BaseResponseDto updateUser(UserRequestDto requestDto, Integer userId);

	public BaseResponseDto followUser(Integer userId1, Integer userId2);

	public BaseResponseDto deleteUser(Integer userId);
}
