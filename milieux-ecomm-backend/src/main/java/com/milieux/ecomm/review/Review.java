package com.milieux.ecomm.review;

public record Review(
    Integer id,
    Integer product_id,
    Integer user_id,
    Double rating,
    String review
) {
}
