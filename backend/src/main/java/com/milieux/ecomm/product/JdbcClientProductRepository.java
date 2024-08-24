package com.milieux.ecomm.product;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.simple.JdbcClient;

@Repository
public class JdbcClientProductRepository {
    private final JdbcClient jdbcClient;

    public JdbcClientProductRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Product> findAll() {
        return jdbcClient.sql("SELECT * FROM product")  // Removed "ecommerce." if not needed
            .query(Product.class)
            .list();
    }

    public Optional<Product> findById(Integer id) {
        return jdbcClient.sql("SELECT * FROM product WHERE id = :id")
            .param("id", id)
            .query(Product.class)
            .optional();
    }

    public List<Product> findByStoreId(Integer store_id) {
        return jdbcClient.sql("SELECT * FROM product WHERE store_id = :store_id")
            .param("store_id", store_id)
            .query(Product.class)
            .list();
    }
    
    public List<Product> findByName(String name) {
        return jdbcClient.sql("SELECT * FROM product WHERE name LIKE :name")
            .param("name", "%" + name + "%")  // Add wildcards for pattern matching
            .query(Product.class)
            .list();
    }
    

    public void create(Product product) {
        jdbcClient.sql("INSERT INTO product (id, name, category, price, description, imgurl, store_id) VALUES (:id, :name, :category, :price, :description, :imgurl, :store_id)")
            .param("id", product.id())  // Ensure all fields are correctly matched
            .param("name", product.name())
            .param("price", product.price())
            .param("imgurl", product.imgurl())
            .param("store_id", product.store_id())
            .param("category", product.category())
            .param("description", product.description())
            .update();
    }

    public void update(Product product, Integer id) {
        jdbcClient.sql("UPDATE product SET name = :name, category = :category, price = :price, imgurl = :imgurl, description = :description, store_id = :store_id WHERE id = :id")
            .param("id", id)
            .param("name", product.name())
            .param("price", product.price())
            .param("imgurl", product.imgurl())
            .param("store_id", product.store_id())
            .param("category", product.category())
            .param("description", product.description())
            .update();
    }

    public void delete(Integer id) {
        jdbcClient.sql("DELETE FROM product WHERE id = :id")
            .param("id", id)
            .update();
    }
}
