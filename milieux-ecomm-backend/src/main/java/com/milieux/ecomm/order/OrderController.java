package com.milieux.ecomm.order;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ecomm/api/order")
public class OrderController {    
    private final JdbcClientOrderRepository repository;

    public OrderController(JdbcClientOrderRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/all")
    List<Order> findAll() {
        return repository.findAll();
    }

    @GetMapping("/find/{id}")
    Optional<Order> findById(@PathVariable Integer id) {
        return repository.findById(id);
    }

    @GetMapping("/find/user/{user_id}")
    List<Order> findByUserId(@PathVariable Integer user_id) {
        return repository.findByUserId(user_id);
    }

    @GetMapping("/find/store/{store_id}")
    List<Order> findByStoreId(@PathVariable Integer store_id) {
        return repository.findByStoreId(store_id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    void create(@RequestBody Order order) {
        // System.out.println(order);
        repository.create(order);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/{id}")
    void update(@RequestBody Order order, @PathVariable Integer id) {
        repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        repository.update(order, id);
    }

    @GetMapping("/total/{id}")
    Integer total(@PathVariable Integer id) {
        return repository.getTotalOrders(id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/ship/{id}")
    void ship(@PathVariable Integer id) {
        repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        repository.ship(id);
    }
}
