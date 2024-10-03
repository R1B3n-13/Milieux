package com.milieux.models.embeddables;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryItem {

    @JsonProperty("role")
    private String role;

    @JsonProperty("parts")
    private String parts;
}
