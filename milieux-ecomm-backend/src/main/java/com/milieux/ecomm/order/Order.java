package com.milieux.ecomm.order;

import java.time.LocalDateTime;
import java.util.List;

public record Order(
    Integer id,
    Integer user_id,
    Integer store_id,
    List<Integer> product_ids,
    List<Integer> product_quantities,
    String address,
    LocalDateTime timestamp,
    Integer status
) {
    
}
