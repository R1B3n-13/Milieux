package com.milieux.services;

import java.util.List;

import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.UserResponseDto;
import com.milieux.models.User;

public interface UserService {

	public List<UserResponseDto> getAllUsers();

	public UserResponseDto getUserById(Integer userId);

	public UserResponseDto getUserByEmail(String email);

	public UserResponseDto getUserFromAuthHeader(String header);

	public List<UserResponseDto> searchUsers(String query);

	public BaseResponseDto updateUser(User user, Integer userId);

	public BaseResponseDto followUser(Integer userId1, Integer userId2);

	public BaseResponseDto deleteUser(Integer userId);
}
