package com.milieux.services;

import com.milieux.dtos.requests.LoginRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.LoginResponseDto;
import com.milieux.models.User;

public interface AuthService {

	public BaseResponseDto register(User user);

	public LoginResponseDto login(LoginRequestDto requestDto);
}
