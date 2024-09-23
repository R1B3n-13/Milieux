package com.milieux.ecomm.review;

import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcClientReviewRepository {
    
    private final JdbcClient jdbcClient;

    public JdbcClientReviewRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public void create(Review review) {
            jdbcClient.sql("INSERT INTO review (id, product_id, user_id, user_name, user_image, rating, review) VALUES (:id, :product_id, :user_id, :user_name, :user_image, :rating, :review)")
            .param("id", review.id())
            .param("product_id", review.product_id())
            .param("user_id", review.user_id())
            .param("user_name", review.user_name())
            .param("user_image", review.user_image())
            .param("rating", review.rating())
            .param("review", review.review())
            .update();
    }

    public void update(Review review, Integer id) {
        jdbcClient.sql("UPDATE review SET product_id = :product_id, user_id = :user_id, rating = :rating, review = :review WHERE id = :id")
            .param("id", id)
            .param("product_id", review.product_id())
            .param("user_id", review.user_id())
            .param("rating", review.rating())
            .param("review", review.review())
            .update();
    }

    public void delete(Integer id) {
        jdbcClient.sql("DELETE FROM review WHERE id = :id")
            .param("id", id)
            .update();
    }

    public List<Review> findByProductId(Integer product_id) {

        System.out.println("product_id: " + product_id);
        return jdbcClient.sql("SELECT * FROM review WHERE product_id = :product_id")
            .param("product_id", product_id)
            .query(Review.class)
            .list();
    }

    public List<Review> findAll() {
        return jdbcClient.sql("SELECT * FROM review")
            .query(Review.class)
            .list();
    }
}
