package com.milieux.dtos.responses;

import com.milieux.dtos.UserDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto extends BaseResponseDto {

	private UserDto user;

	public UserResponseDto(int statusCode, boolean success, String message, UserDto user) {
		super(statusCode, success, message);
		this.user = user;
	}
}
