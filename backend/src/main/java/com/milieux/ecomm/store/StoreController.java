package com.milieux.ecomm.store;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/all")
    List<Store> findAll() {
        return repository.findAll();  // Ensure this returns a List<Store>
    }

    @GetMapping("/find/{id}")
    Optional <Store> findById(@PathVariable Integer id) {
        Optional <Store> store = repository.findById(id);
        if (store.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found");

        return store;  // Ensure this returns a Store
    }

    @GetMapping("/find/name/{name}")
    List<Store> findByName(@PathVariable String name) {
        return repository.findByName(name);  // Ensure this returns a List<Store>
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    void create(@RequestBody Store store) {
        repository.create(store);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/{id}")
    void update(@RequestBody Store store, @PathVariable Integer id) {
        repository.update(store, id);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    void delete(@PathVariable Integer id) {
        repository.delete(id);
    }
}
