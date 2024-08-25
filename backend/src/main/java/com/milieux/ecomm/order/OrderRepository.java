package com.milieux.ecomm.order;

import java.util.List;

public interface OrderRepository {
    List<Order> findAll();
} 