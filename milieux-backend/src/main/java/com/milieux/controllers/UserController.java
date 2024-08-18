package com.milieux.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.UserListResponseDto;
import com.milieux.dtos.responses.UserResponseDto;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/by-ids")
	public ResponseEntity<UserListResponseDto> getUsersByIds(@RequestBody List<Long> userIds) {

		UserListResponseDto responseDtos = userService.getUsersByIds(userIds);

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping
	public ResponseEntity<UserListResponseDto> getAllUsers() {

		UserListResponseDto responseDtos = userService.getAllUsers();

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long userId) {

		UserResponseDto responseDto = userService.getUserById(userId);

		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/by-email/{email}")
	public ResponseEntity<UserResponseDto> getUserByEmail(@PathVariable String email) {

		UserResponseDto responseDto = userService.getUserByEmail(email);

		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/by-is_business")
	public ResponseEntity<UserListResponseDto> getUsersByIsBusiness() {

		UserListResponseDto responseDtos = userService.getUsersByIsBusiness(true);

		return ResponseEntity.ok(responseDtos);
	}

	@GetMapping("/profile")
	public ResponseEntity<UserResponseDto> getUserFromAuthHeader(@RequestHeader("Authorization") String header) {

		UserResponseDto responseDto = userService.getUserFromAuthHeader(header);

		return ResponseEntity.ok(responseDto);
	}

	@GetMapping("/search")
	public ResponseEntity<UserListResponseDto> searchUsers(@RequestParam String query) {

		UserListResponseDto responseDtos = userService.searchUsers(query);

		return ResponseEntity.ok(responseDtos);
	}

	@PutMapping("/update")
	public ResponseEntity<BaseResponseDto> updateUser(@RequestBody UserRequestDto requestDto,
			@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = userService.updateUser(requestDto, userId);

		return ResponseEntity.ok(responseDto);
	}

	@PutMapping("/follow/{userId2}")
	public ResponseEntity<BaseResponseDto> followUser(@PathVariable Long userId2,
			@RequestHeader("Authorization") String header) {

		Long userId1 = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = userService.followUser(userId1, userId2);

		return ResponseEntity.ok(responseDto);
	}

	@DeleteMapping("/delete")
	public ResponseEntity<BaseResponseDto> deleteUser(@RequestHeader("Authorization") String header) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		BaseResponseDto responseDto = userService.deleteUser(userId);

		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(responseDto);
	}
}
