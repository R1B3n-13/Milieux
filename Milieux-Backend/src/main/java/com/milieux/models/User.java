package com.milieux.models;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String firstName;
	private String lastName;
	private String email;
	private String gender;
	private String password;

	@ElementCollection
	@CollectionTable(name = "user_followers")
	@Column(name = "follower_id")
	private List<Long> followers = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "user_followings")
	@Column(name = "following_id")
	private List<Long> followings = new ArrayList<>();

	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private List<Post> posts;

	@ManyToMany(mappedBy = "likedByUsers")
	@JsonIgnore
	private List<Post> likedPosts = new ArrayList<>();

	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private List<Comment> comments = new ArrayList<>();

	@ManyToMany(mappedBy = "likedByUsers")
	@JsonIgnore
	private List<Post> likedComments = new ArrayList<>();

	@OneToMany(mappedBy = "user")
	@JsonIgnore
	private List<Story> stories = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "saved_posts", //
			joinColumns = @JoinColumn(name = "user_id"), //
			inverseJoinColumns = @JoinColumn(name = "post_id"))
	@JsonIgnore
	private List<Post> savedPosts = new ArrayList<>();

	private ZonedDateTime createdAt;

	@PrePersist
	protected void onCreate() {

		this.createdAt = ZonedDateTime.now();
	}
}