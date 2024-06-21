package com.milieux.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import com.milieux.exceptions.AuthTokenNotFoundException;
import com.milieux.exceptions.AuthenticationFailedException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

	@Autowired
	@Qualifier("handlerExceptionResolver")
	private HandlerExceptionResolver exceptionResolver;

	@Autowired
	private JwtUtils jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		if (request.getRequestURI().startsWith("/auth")) {

			filterChain.doFilter(request, response);

			return;
		}

		try {
			String token = jwtUtil.getTokenFromHeader(request.getHeader("Authorization"));

			if (token != null) {

				jwtUtil.validateToken(token);

				try {
					String email = jwtUtil.getEmailFromToken(token);

					List<GrantedAuthority> authorities = new ArrayList<>();

					Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);

					SecurityContextHolder.getContext().setAuthentication(authentication);

				} catch (Exception e) {

					throw new AuthenticationFailedException("Authentication failed");
				}
			} else {

				throw new AuthTokenNotFoundException("Jwt auth token is missing");
			}
		} catch (Exception e) {

			exceptionResolver.resolveException(request, response, null, e);

			return;
		}

		filterChain.doFilter(request, response);
	}
}
