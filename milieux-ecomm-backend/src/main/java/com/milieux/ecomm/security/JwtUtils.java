package com.milieux.ecomm.security;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expirationInMs}")
	private int jwtExpirationInMs;

	private Key key() {

		return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
	}

	public String getTokenFromHeader(String header) {

		if (header != null && header.startsWith("Bearer ")) {

			return header.substring(7);
		}

		return null;
	}

	public void validateToken(String token) {

		try {
			Jwts.parser().verifyWith((SecretKey) key()).build().parseSignedClaims(token);

		} catch (Exception e) {

			throw e;
		}
	}

	public String getEmailFromToken(String token) {

		return Jwts.parser()

				.verifyWith((SecretKey) key())

				.build().parseSignedClaims(token)

				.getPayload().getSubject();
	}
}
