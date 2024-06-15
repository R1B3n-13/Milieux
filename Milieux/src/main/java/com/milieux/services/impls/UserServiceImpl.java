package com.milieux.services.impls;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.milieux.dtos.UserDto;
import com.milieux.dtos.responses.BaseResponseDto;
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
	JwtUtils jwtUtils;

	@Override
	public List<UserResponseDto> getAllUsers() {

		List<User> users = userRepository.findAll();

		return users.stream().map(user -> {

			UserDto dto = modelMapper.map(user, UserDto.class);

			return new UserResponseDto(200, true, "User fetched successfully", dto);

		}).collect(Collectors.toList());
	}

	@Override
	public UserResponseDto getUserById(Integer userId) {

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		UserDto dto = modelMapper.map(user, UserDto.class);

		return new UserResponseDto(200, true, "User fetched successfully", dto);
	}

	@Override
	public UserResponseDto getUserByEmail(String email) {

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("No user present with email: " + email));

		UserDto dto = modelMapper.map(user, UserDto.class);

		return new UserResponseDto(200, true, "User fetched successfully", dto);
	}

	@Override
	public UserResponseDto getUserFromAuthHeader(String header) {

		String token = jwtUtils.getTokenFromHeader(header);

		String email = jwtUtils.getEmailFromToken(token);

		return getUserByEmail(email);
	}

	@Override
	public List<UserResponseDto> searchUsers(String query) {

		List<User> users = userRepository.searchUsers(query);

		return users.stream().map(user -> {

			UserDto dto = modelMapper.map(user, UserDto.class);

			return new UserResponseDto(200, true, "User fetched successfully", dto);

		}).collect(Collectors.toList());
	}

	@Override
	public BaseResponseDto updateUser(User user, Integer userId) {

		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		if (user.getFirstName() != null) {

			existingUser.setFirstName(user.getFirstName());
		}
		if (user.getLastName() != null) {

			existingUser.setLastName(user.getLastName());
		}
		if (user.getEmail() != null) {

			existingUser.setEmail(user.getEmail());
		}
		if (user.getPassword() != null) {

			existingUser.setPassword(user.getPassword());
		}

		userRepository.save(existingUser);

		return new BaseResponseDto(200, true, "User updated successfully!");
	}

	@Override
	public BaseResponseDto followUser(Integer userId1, Integer userId2) {

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
	public BaseResponseDto deleteUser(Integer userId) {

		User existingUser = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("No user present with id: " + userId));

		userRepository.delete(existingUser);

		return new BaseResponseDto(204, true, "User deleted successfully!");
	}
}
