package com.milieux.milieux_api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class MilieuxApiGatewayApplication {

	public static void main(String[] args) {

		Dotenv dotenv = Dotenv.load();

		System.setProperty("SPRING_CLOUD_GATEWAY_ROUTES_0_URI",
				dotenv.get("SPRING_CLOUD_GATEWAY_ROUTES_0_URI", "http://localhost:8082"));

		System.setProperty("SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0",
				dotenv.get("SPRING_CLOUD_GATEWAY_ROUTES_0_PREDICATES_0", "/ecomm/**"));

		System.setProperty("SPRING_CLOUD_GATEWAY_ROUTES_1_URI",
				dotenv.get("SPRING_CLOUD_GATEWAY_ROUTES_1_URI", "http://localhost:8081"));

		System.setProperty("SPRING_CLOUD_GATEWAY_ROUTES_1_PREDICATES_0",
				dotenv.get("SPRING_CLOUD_GATEWAY_ROUTES_1_PREDICATES_0", "/**"));

		System.setProperty("SPRING_CLOUD_GATEWAY_GLOBALCORS_CORS_CONFIGURATIONS___ALLOWEDORIGINS_0",
				dotenv.get("SPRING_CLOUD_GATEWAY_GLOBALCORS_CORS_CONFIGURATIONS___ALLOWEDORIGINS_0",
						"http://localhost:3000/"));

		System.setProperty("SPRING_CLOUD_GATEWAY_GLOBALCORS_CORS_CONFIGURATIONS___ALLOWEDORIGINS_1",
				dotenv.get("SPRING_CLOUD_GATEWAY_GLOBALCORS_CORS_CONFIGURATIONS___ALLOWEDORIGINS_1",
						"http://localhost:3001/"));

		System.setProperty("SERVER_PORT", dotenv.get("SERVER_PORT", "8080"));

		SpringApplication.run(MilieuxApiGatewayApplication.class, args);
	}
}