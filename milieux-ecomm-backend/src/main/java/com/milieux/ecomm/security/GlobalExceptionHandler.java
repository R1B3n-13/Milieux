package com.milieux.ecomm.security;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import com.milieux.ecomm.security.BaseResponseDto;

@ControllerAdvice
@Order(2)
public class GlobalExceptionHandler {

	@ExceptionHandler(AuthTokenNotFoundException.class)
	public ResponseEntity<BaseResponseDto> handleAuthTokenNotFoundException(AuthTokenNotFoundException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(AuthenticationFailedException.class)
	public ResponseEntity<BaseResponseDto> handleAuthenticationFailedException(AuthenticationFailedException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<BaseResponseDto> handleResponseStatusException(ResponseStatusException ex) {

		return new ResponseEntity<BaseResponseDto>(new BaseResponseDto(ex.getStatusCode().value(), false, ex.getMessage()), ex.getStatusCode());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<BaseResponseDto> handleGeneralException(Exception ex) {

		return new ResponseEntity<>(new BaseResponseDto(500, false, "Internal server error"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
