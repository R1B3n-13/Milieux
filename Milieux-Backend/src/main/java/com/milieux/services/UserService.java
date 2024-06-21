package com.milieux.services;

import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.UserListResponseDto;
import com.milieux.dtos.responses.UserResponseDto;

public interface UserService {

	public UserListResponseDto getAllUsers();

	public UserResponseDto getUserById(Long userId);

	public UserResponseDto getUserByEmail(String email);

	public UserResponseDto getUserFromAuthHeader(String header);

	public UserListResponseDto searchUsers(String query);

	public BaseResponseDto updateUser(UserRequestDto requestDto, Long userId);

	public BaseResponseDto followUser(Long userId1, Long userId2);

	public BaseResponseDto deleteUser(Long userId);
}
