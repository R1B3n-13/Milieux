package com.milieux.ecomm.review;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private final JdbcClientReviewRepository repository;

    public ReviewController(JdbcClientReviewRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/all")
    List<Review> findAll() {
        return repository.findAll();
    }

    @GetMapping("/find/{id}")
    List <Review> findById(@PathVariable Integer id) {
        return repository.findByProductId(id);
    }

    @PostMapping("/create")
    void create(@RequestBody Review review) {
        repository.create(review);
    }

    @PostMapping("/update/{id}")
    void update(@RequestBody Review review, @PathVariable Integer id) {
        repository.update(review, id);
    }

    @DeleteMapping("/delete/{id}")
    void delete(@PathVariable Integer id) {
        repository.delete(id);
    }
}
