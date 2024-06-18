package com.milieux.services.impls;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.milieux.dtos.requests.LoginRequestDto;
import com.milieux.dtos.requests.UserRequestDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.dtos.responses.LoginResponseDto;
import com.milieux.exceptions.UserAlreadyExistsException;
import com.milieux.exceptions.WrongCredentialsException;
import com.milieux.models.User;
import com.milieux.repositories.UserRepository;
import com.milieux.security.JwtUtils;
import com.milieux.services.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtUtils jwtUtil;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public BaseResponseDto register(UserRequestDto requestDto) {

		try {
			requestDto.setPassword(passwordEncoder.encode(requestDto.getPassword()));

			User user = modelMapper.map(requestDto, User.class);

			userRepository.save(user);

			return new BaseResponseDto(201, true, "Registration Sucessful!");

		} catch (DataIntegrityViolationException e) {

			throw new UserAlreadyExistsException("User already exists with email: " + requestDto.getEmail());
		}
	}

	@Override
	public LoginResponseDto login(LoginRequestDto requestDto) {

		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(requestDto.getEmail(), requestDto.getPassword()));

			SecurityContextHolder.getContext().setAuthentication(authentication);

			String token = jwtUtil.generateToken(authentication);

			return new LoginResponseDto(200, true, "Login successful!", token);

		} catch (Exception e) {

			throw new WrongCredentialsException("Wrong credentials");
		}
	}
}
