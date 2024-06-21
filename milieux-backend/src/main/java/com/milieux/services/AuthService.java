package com.milieux.services;

import com.milieux.dtos.requests.LoginRequestDto;
import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.LoginResponseDto;

public interface AuthService {

	public BaseResponseDto register(UserRequestDto requestDto);

	public LoginResponseDto login(LoginRequestDto requestDto);
}
