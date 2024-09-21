package com.milieux.ecomm.review;

public record Review(
    Integer id,
    Integer product_id,
    Integer user_id,
    String user_name,
    String user_image,
    Double rating,
    String review
) {
}
