package com.milieux.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

	@GetMapping({ "/", "/home" })
	public String handleHomeController() {
		return "home";
	}
}
