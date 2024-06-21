package com.milieux.dtos;

import java.time.ZonedDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

	private Long id;
	private String firstName;
	private String lastName;
	private String gender;
	private String email;

	private List<Long> followers;
	private List<Long> followings;

	private ZonedDateTime createdAt;
}
