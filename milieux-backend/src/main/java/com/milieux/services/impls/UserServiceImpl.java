package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.UserDto;
import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.UserListResponseDto;
import com.milieux.dtos.responses.UserResponseDto;
import com.milieux.exceptions.UserNotFoundException;
import com.milieux.models.User;
import com.milieux.repositories.UserRepository;
import com.milieux.security.JwtUtils;
import com.milieux.services.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private JwtUtils jwtUtils;

	@Override
	public UserListResponseDto getAllUsers() {

		List<User> users = userRepository.findAll();

		List<UserDto> dtos = users.stream().map(user -> modelMapper.map(user, UserDto.class))
				.collect(Collectors.toList());

		return new UserListResponseDto(200, true, "Users fetched successfully!", dtos);
	}

	@Override
	public UserResponseDto getUserById(Long userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		UserDto dto = modelMapper.map(user, UserDto.class);

		return new UserResponseDto(200, true, "User fetched successfully!", dto);
	}

	@Override
	public UserResponseDto getUserByEmail(String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("No user present with email: " + email));

		UserDto dto = modelMapper.map(user, UserDto.class);

		return new UserResponseDto(200, true, "User fetched successfully!", dto);
	}

	@Override
	public UserResponseDto getUserFromAuthHeader(String header) {

		String token = jwtUtils.getTokenFromHeader(header);

		String email = jwtUtils.getEmailFromToken(token);

		return getUserByEmail(email);
	}

	@Override
	public UserListResponseDto searchUsers(String query) {

		List<User> users = userRepository.searchUsers(query);

		List<UserDto> dtos = users.stream().map(user -> modelMapper.map(user, UserDto.class))
				.collect(Collectors.toList());

		return new UserListResponseDto(200, true, "Users fetched successfully!", dtos);
	}

	@Override
	public BaseResponseDto updateUser(UserRequestDto requestDto, Long userId) {

		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (requestDto.getName() != null) {

			existingUser.setName(requestDto.getName());
		}
		if (requestDto.getEmail() != null) {

			existingUser.setEmail(requestDto.getEmail());
		}
		if (requestDto.getGender() != null) {

			existingUser.setGender(requestDto.getGender());
		}
		if (requestDto.getPassword() != null) {

			existingUser.setPassword(requestDto.getPassword());
		}

		userRepository.save(existingUser);

		return new BaseResponseDto(200, true, "User updated successfully!");
	}

	@Override
	public BaseResponseDto followUser(Long userId1, Long userId2) {

		User user1 = userRepository.findById(userId1)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId1));
		User user2 = userRepository.findById(userId2)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId2));

		if (user1.getFollowings().contains(userId2)) {

			user1.getFollowings().remove(userId2);
			user2.getFollowers().remove(userId1);

			userRepository.save(user1);
			userRepository.save(user2);

			return new BaseResponseDto(200, true, "User unfollowed successfully!");
		} else {
			user1.getFollowings().add(userId2);
			user2.getFollowers().add(userId1);

			userRepository.save(user1);
			userRepository.save(user2);

			return new BaseResponseDto(200, true, "User followed successfully!");
		}
	}

	@Override
	public BaseResponseDto deleteUser(Long userId) {

		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		userRepository.delete(existingUser);

		return new BaseResponseDto(204, true, "User deleted successfully!");
	}
}
