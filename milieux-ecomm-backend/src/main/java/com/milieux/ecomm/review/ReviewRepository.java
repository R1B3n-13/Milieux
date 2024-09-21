package com.milieux.ecomm.review;

import java.util.List;

public interface ReviewRepository {
    List<Review> findAll();
    Review findById(Integer id);
    List<Review> findByProductId(Integer productId);
}
