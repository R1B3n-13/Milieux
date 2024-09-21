package com.milieux.ecomm.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;

import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.milieux.ecomm.security.BaseResponseDto;

@ControllerAdvice
@Order(1)
public class JwtExceptionHandler {

	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<BaseResponseDto> handleExpiredJwtException(ExpiredJwtException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, "JWT token has expired"), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(SignatureException.class)
	public ResponseEntity<BaseResponseDto> handleSignatureException(SignatureException ex) {

		return new ResponseEntity<>(new BaseResponseDto(401, false, "Invalid JWT signature"), HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(MalformedJwtException.class)
	public ResponseEntity<BaseResponseDto> handleMalformedJwtException(MalformedJwtException ex) {

		return new ResponseEntity<>(new BaseResponseDto(400, false, "Malformed JWT token"), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UnsupportedJwtException.class)
	public ResponseEntity<BaseResponseDto> handleUnsupportedJwtException(UnsupportedJwtException ex) {

		return new ResponseEntity<>(new BaseResponseDto(400, false, "Unsupported JWT token"), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<BaseResponseDto> handleIllegalArgumentException(IllegalArgumentException ex) {

		return new ResponseEntity<>(new BaseResponseDto(400, false, ex.getMessage()), HttpStatus.BAD_REQUEST);
	}
}
