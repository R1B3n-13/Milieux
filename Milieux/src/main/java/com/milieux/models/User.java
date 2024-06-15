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

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	private String firstName;
	private String lastName;
	private String email;
	private String gender;
	private String password;

	@ElementCollection
	@CollectionTable(name = "user_followers")
	@Column(name = "follower_id")
	private List<Integer> followers = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "user_followings")
	@Column(name = "following_id")
	private List<Integer> followings = new ArrayList<>();

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

	@ManyToMany
	@JoinTable(name = "saved_posts", //
			joinColumns = @JoinColumn(name = "user_id"), //
			inverseJoinColumns = @JoinColumn(name = "post_id"))
	@JsonIgnore
	private List<Post> savedPosts = new ArrayList<>();

	private ZonedDateTime createdAt;

	public User() {
	}

	@PrePersist
	protected void onCreate() {

		this.createdAt = ZonedDateTime.now();
	}

	public User(Integer id, String firstName, String lastName, String email, String gender, String password,
			List<Integer> followers, List<Integer> followings, List<Post> posts, List<Post> likedPosts,
			List<Comment> comments, List<Post> likedComments, List<Post> savedPosts, ZonedDateTime createdAt) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.gender = gender;
		this.password = password;
		this.followers = followers;
		this.followings = followings;
		this.posts = posts;
		this.likedPosts = likedPosts;
		this.comments = comments;
		this.likedComments = likedComments;
		this.savedPosts = savedPosts;
		this.createdAt = createdAt;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public List<Integer> getFollowers() {
		return followers;
	}

	public void setFollowers(List<Integer> followers) {
		this.followers = followers;
	}

	public List<Integer> getFollowings() {
		return followings;
	}

	public void setFollowings(List<Integer> followings) {
		this.followings = followings;
	}

	public List<Post> getPosts() {
		return posts;
	}

	public void setPosts(List<Post> posts) {
		this.posts = posts;
	}

	public List<Post> getLikedPosts() {
		return likedPosts;
	}

	public void setLikedPosts(List<Post> likedPosts) {
		this.likedPosts = likedPosts;
	}

	public List<Post> getSavedPosts() {
		return savedPosts;
	}

	public void setSavedPosts(List<Post> savedPosts) {
		this.savedPosts = savedPosts;
	}

	public ZonedDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(ZonedDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public List<Comment> getComments() {
		return comments;
	}

	public void setComments(List<Comment> comments) {
		this.comments = comments;
	}

	public List<Post> getLikedComments() {
		return likedComments;
	}

	public void setLikedComments(List<Post> likedComments) {
		this.likedComments = likedComments;
	}

}
