package com.milieux.ecomm.store;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@RequestMapping("/api/store")
@CrossOrigin(origins = "http://localhost:3000")
public class StoreController {

    private final JdbcClientStoreRepository repository;

    public StoreController(JdbcClientStoreRepository repository) {
        this.repository = repository;
    }

    // Get all stores
    @GetMapping("/all")
    public List<Store> findAll() {
        return repository.findAll();  // Returns a List<Store>
    }

    // Get store by id
    @GetMapping("/find/{id}")
    public Store findById(@PathVariable Integer id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));
    }

    // Find stores by name (partial match)
    @GetMapping("/find/name/{name}")
    public List<Store> findByName(@PathVariable String name) {
        return repository.findByName(name);  // Returns a List<Store> matching the name
    }

    // Create a new store
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public void create(@RequestBody Store store) {
        repository.create(store);  // Calls the repository to insert the store
    }

    // Update an existing store
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/{id}")
    public void update(@RequestBody Store store, @PathVariable Integer id) {
        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.update(store, id);  // Calls the repository to update the store
    }

    // Delete a store by id
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.delete(id);  // Calls the repository to delete the store
    }
}
