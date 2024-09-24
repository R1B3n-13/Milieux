package com.milieux.controllers;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.milieux.dtos.requests.AiToolRequestDto;
import com.milieux.dtos.responses.AiToolResponseDto;
import com.milieux.dtos.responses.BaseResponseDto;
import com.milieux.services.AiToolService;
import com.milieux.services.UserService;

@RestController
@RequestMapping("/ai-chat/tools")
public class AiToolController {

	@Autowired
	private AiToolService aiToolService;

	@Autowired
	private UserService userService;

	@PostMapping("/create")
	public ResponseEntity<BaseResponseDto> createAiTool(@RequestHeader("Authorization") String header,
			@RequestParam(required = false) MultipartFile fileData,
			@RequestParam(required = false) String currentFileName, @RequestParam Float temperature,
			@RequestParam Float topP, @RequestParam Integer topK, @RequestParam String systemInstruction) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		AiToolRequestDto requestDto = new AiToolRequestDto();

		requestDto.setCurrentFileName(currentFileName);
		requestDto.setTemperature(temperature);
		requestDto.setTopP(topP);
		requestDto.setTopK(topK);
		requestDto.setSystemInstruction(systemInstruction);

		if (fileData != null) {
			try {
				requestDto.setFileData(fileData.getBytes());
			} catch (IOException e) {
				return ResponseEntity.badRequest().body(new BaseResponseDto(400, false, "Failed to process file data"));
			}
		}

		BaseResponseDto responseDto = aiToolService.createAiTool(userId, requestDto);

		return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
	}

	@GetMapping("/{userId}")
	public ResponseEntity<AiToolResponseDto> getAiTool(@PathVariable Long userId) {

		AiToolResponseDto responseDto = aiToolService.getAiTool(userId);

		return ResponseEntity.ok(responseDto);
	}

	@PutMapping("/update")
	public ResponseEntity<BaseResponseDto> updateAiTool(@RequestHeader("Authorization") String header,
			@RequestParam(required = false) MultipartFile fileData,
			@RequestParam(required = false) String currentFileName, @RequestParam Float temperature,
			@RequestParam Float topP, @RequestParam Integer topK, @RequestParam String systemInstruction) {

		Long userId = userService.getUserFromAuthHeader(header).getUser().getId();

		AiToolRequestDto requestDto = new AiToolRequestDto();

		requestDto.setCurrentFileName(currentFileName);
		requestDto.setTemperature(temperature);
		requestDto.setTopP(topP);
		requestDto.setTopK(topK);
		requestDto.setSystemInstruction(systemInstruction);

		if (fileData != null) {
			try {
				requestDto.setFileData(fileData.getBytes());
			} catch (IOException e) {
				return ResponseEntity.badRequest().body(new BaseResponseDto(400, false, "Failed to process file data"));
			}
		}

		BaseResponseDto responseDto = aiToolService.updateAiTool(requestDto, userId);

		return ResponseEntity.ok(responseDto);
	}
}
