package com.milieux.exceptions;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.milieux.dtos.responses.BaseResponseDto;

@ControllerAdvice
@Order(2)
public class GlobalExceptionHandler {

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<BaseResponseDto> handleUserNotFoundException(UserNotFoundException ex) {

		return new ResponseEntity<>(new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<BaseResponseDto> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {

		return new ResponseEntity<>(new BaseResponseDto(409, false, ex.getMessage()), HttpStatus.CONFLICT);
	}

	@ExceptionHandler(UserNotAuthorizedException.class)
	public ResponseEntity<BaseResponseDto> handleUserNotAuthorizedException(UserNotAuthorizedException ex) {

		return new ResponseEntity<>(new BaseResponseDto(403, false, ex.getMessage()), HttpStatus.FORBIDDEN);
	}

	@ExceptionHandler(PostNotFoundException.class)
	public ResponseEntity<BaseResponseDto> handlePostNotFoundException(PostNotFoundException ex) {

		return new ResponseEntity<>(new BaseResponseDto(404, false, ex.getMessage()), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(PostAlreadySavedException.class)
	public ResponseEntity<BaseResponseDto> handlePostAlreadySavedException(PostAlreadySavedException ex) {

		return new ResponseEntity<>(new BaseResponseDto(409, false, ex.getMessage()), HttpStatus.CONFLICT);
	}

	@ExceptionHandler(AuthTokenNotFoundException.class)
	public ResponseEntity<BaseResponseDto> handleAuthTokenNotFoundException(AuthTokenNotFoundException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(AuthenticationFailedException.class)
	public ResponseEntity<BaseResponseDto> handleAuthenticationFailedException(AuthenticationFailedException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(WrongCredentialsException.class)
	public ResponseEntity<BaseResponseDto> handleWrongCredentialsException(WrongCredentialsException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<BaseResponseDto> handleGeneralException(Exception ex) {

		return new ResponseEntity<>(new BaseResponseDto(500, false, "Internal server error"), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
