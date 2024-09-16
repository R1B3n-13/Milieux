package com.milieux.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatParamsRequestDto {

	private String currentPdfName;

	private Float temperature;
	private Float topP;
	private Integer topK;

	private String systemInstruction;
}
