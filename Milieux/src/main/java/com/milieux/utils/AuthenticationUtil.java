package com.milieux.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.milieux.exceptions.WrongCredentialsException;
import com.milieux.services.impls.CustomUserDetailsService;

public class AuthenticationUtil {

	@Autowired
	CustomUserDetailsService customUserDetailsService;

	@Autowired
	PasswordEncoder passwordEncoder;

	public Authentication authenticate(String email, String password) {

		try {
			UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

			if (!passwordEncoder.matches(password, userDetails.getPassword())) {

				throw new Exception();
			}

		} catch (Exception e) {

			throw new WrongCredentialsException("Wrong credentials!");
		}

		return new UsernamePasswordAuthenticationToken(email, password);
	}
}
