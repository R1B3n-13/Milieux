package com.milieux.ecomm.product;

import java.time.LocalDateTime;

public record Product(
    Integer id,
    Integer store_id,
    String name,
    String description,
    String category,
    Double price,
    LocalDateTime created_at,
    String imgurl  // Use img_url to match the column name
) {}

