package com.milieux.ecomm.store;

import java.util.List;
import java.util.Map;

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
@RequestMapping("/ecomm/api/store")
public class StoreController {

    private final JdbcClientStoreRepository repository;

    public StoreController(JdbcClientStoreRepository repository) {
        this.repository = repository;
    }

    // Get all stores
    @GetMapping("/all")
    public List<Store> findAll() {
        return repository.findAll(); // Returns a List<Store>
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
        return repository.findByName(name); // Returns a List<Store> matching the name
    }

    // Create a new store
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public void create(@RequestBody Map<String, Object> storeData) {
        Integer temp_id = (Integer) storeData.get("id"); 
        String name = (String) storeData.get("name");
        String category = (String) storeData.get("category");
        
        System.out.println(temp_id);
        repository.create(temp_id, name, category);
    }
    
    

    // update top products
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/top-products/{id}")
    public void updateTopProducts(@PathVariable Integer id, @RequestBody List<Integer> topProducts) {
        repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.updateTopProducts(id, topProducts); // Calls the repository to update the store
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/name/{id}")
    public void updateName(@PathVariable Integer id, @RequestBody String name) {
        String storeName = "";
        for (int i = 1; i < name.length() - 1; i++)
            storeName += name.charAt(i);

        System.out.println(storeName);
        repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.updateName(id, storeName); // Calls the repository to update the store
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/logo/{id}")
    public void updateLogo(@PathVariable Integer id, @RequestBody String url)   {
        String updatedLogoUrl = "";

        for (int i = 1; i < url.length() - 1; i++)
            updatedLogoUrl += url.charAt(i);

        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));
        
        repository.updateLogo(id, updatedLogoUrl);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/ui-type/{id}")
    public void updateUiType(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        Integer uiType = body.get("ui_type");
        repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.updateUiType(id, uiType); // Calls the repository to update the store
    }

    // hero images
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/ui-images/{id}")
    public void updateUiImages(@PathVariable Integer id, @RequestBody List<String> images) {
        repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.updateUiImages(id, images);

    }

    // update banner
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/banner/{id}")
    public void updateBanner(@PathVariable Integer id, @RequestBody String url) {
        String updatedBannerUrl = "";

        for (int i = 1; i < url.length() - 1; i++)
            updatedBannerUrl += url.charAt(i);

        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));
        
        repository.updateBanner(id, updatedBannerUrl);
    }

    // update subtext
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/subtext/{id}")
    public void updateSubtext(@PathVariable Integer id, @RequestBody String subtext) {
        String updatedSubtext = "";
        for (int i = 1; i < subtext.length() - 1; i++)
            updatedSubtext += subtext.charAt(i);

        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));
        
        repository.updateSubtext(id, updatedSubtext);
    }

    // update colors
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/update/colors/{id}")
    public void updateColors(@PathVariable Integer id, @RequestBody Map<String, String> colors) {
        String baseColor = colors.get("ui_base_color");
        String secondaryColor = colors.get("ui_secondary_color");
        String accentColor = colors.get("ui_accent_color");

        System.out.println(baseColor);

        repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));
        
        repository.updateColors(id, baseColor, secondaryColor, accentColor);
    }

    // Delete a store by id
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id) {
        repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Store not found"));

        repository.delete(id); // Calls the repository to delete the store
    }
}
