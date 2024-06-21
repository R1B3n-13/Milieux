package com.milieux.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.milieux.security.AuthTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private AuthTokenFilter authTokenFilter;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

		return httpSecurity

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(authorize -> {

					authorize.requestMatchers("/auth/**").permitAll();

					authorize.anyRequest().authenticated();
				})

				.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))

				.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)

				.csrf(csrf -> csrf.disable()).build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {

		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration builder) throws Exception {

		return builder.getAuthenticationManager();
	}
}
