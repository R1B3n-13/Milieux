package com.milieux.models;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.milieux.models.embeddables.ChatHistoryItem;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ai_chat_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiChatSession {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Long chatbotId;

	private String name;

	@ElementCollection
	@CollectionTable(name = "chat_history")
	@Column(name = "ai_chat_history")
	@JdbcTypeCode(SqlTypes.JSON)
	@JsonIgnore
	private List<ChatHistoryItem> chatHistory = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private User user;

	private ZonedDateTime createdAt;

	@PrePersist
	protected void onCreate() {

		this.createdAt = ZonedDateTime.now();
	}
}
