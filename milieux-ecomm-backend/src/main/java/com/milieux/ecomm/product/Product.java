package com.milieux.ecomm.product;

public record Product(
    Integer id,
    String name,
    String category,
    Double price,
    String description,
    // LocalDateTime created_at,
    String imgurl,  // Use img_url to match the column name
    Integer store_id
) {}

