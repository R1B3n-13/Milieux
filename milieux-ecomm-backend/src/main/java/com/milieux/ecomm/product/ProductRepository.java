package com.milieux.ecomm.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.ListCrudRepository;

public interface ProductRepository extends ListCrudRepository<Product, Integer> {
    List<Product> findAll();
    Optional<Product> findById(Integer id);
}
