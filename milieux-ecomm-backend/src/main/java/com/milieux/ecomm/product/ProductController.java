package com.milieux.ecomm.product;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/ecomm/api/product")
public class ProductController {

    private final JdbcClientProductRepository repository;

    public ProductController(JdbcClientProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/all")
    List<Product> findAll() {
        return repository.findAll();
    }
    
    @GetMapping("/find/{id}")
    Optional<Product> findById(@PathVariable Integer id) {
        Optional<Product> product = repository.findById(id);
        if (product.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        return product;
    }
    
    @GetMapping("/find/name/{name}")
    List<Product> findByName(@PathVariable String name) {
        return repository.findByName(name);
    }
    
    @GetMapping("/store/{store_id}")
    List<Product> findByStoreId(@PathVariable Integer store_id) {
        return repository.findByStoreId(store_id);
    }

    
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    void create(@RequestBody Product product) {
        repository.create(product);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/{id}")
    void update(@RequestBody Product product, @PathVariable Integer id) {
        repository.update(product, id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    void delete(@PathVariable Integer id) {
        repository.delete(id);
    }
}
