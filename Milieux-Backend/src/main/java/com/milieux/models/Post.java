package com.milieux.models;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	@JsonIgnore
	private User user;

	private String caption;
	private String imagePath;
	private String videoPath;

	@ManyToMany
	@JoinTable(name = "post_likes", //
			joinColumns = @JoinColumn(name = "post_id"), //
			inverseJoinColumns = @JoinColumn(name = "user_id"))
	@JsonIgnore
	private List<User> likedByUsers = new ArrayList<>();

	@OneToMany(mappedBy = "post")
	@JsonIgnore
	private List<Comment> comments = new ArrayList<>();

	private ZonedDateTime createdAt;

	@PrePersist
	protected void onCreate() {

		this.createdAt = ZonedDateTime.now();
	}
}
