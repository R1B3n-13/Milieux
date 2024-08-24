package com.milieux.ecomm.store;

import java.sql.Array;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcClientStoreRepository {
    private final JdbcClient jdbcClient;

    public JdbcClientStoreRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Store> findAll() {
        return jdbcClient.sql("SELECT * FROM store")
                .query((rs, rowNum) -> {
                    // Convert PgArray to List<String> and List<Integer>
                    Array imagesArray = rs.getArray("ui_images");
                    Array topItemsArray = rs.getArray("top_items");

                    List<String> uiImages = null;
                    List<Integer> topItems = null;

                    if (imagesArray != null) {
                        try {
                            String[] images = (String[]) imagesArray.getArray();
                            uiImages = Arrays.asList(images);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<String>", e);
                        }
                    }

                    if (topItemsArray != null) {
                        try {
                            Integer[] items = (Integer[]) topItemsArray.getArray();
                            topItems = Arrays.asList(items);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<Integer>", e);
                        }
                    }

                    return new Store(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getInt("ui_type"),
                            rs.getString("ui_font"),
                            rs.getString("ui_font_special"),
                            rs.getString("ui_accent_color"),
                            rs.getString("ui_base_color"),
                            rs.getString("ui_secondary_color"),
                            rs.getString("banner"),
                            rs.getString("banner_subtext"),
                            rs.getString("logo_url"),
                            uiImages,
                            topItems
                    );
                }).list();
    }

    public Optional<Store> findById(Integer id) {
        return jdbcClient.sql("SELECT * FROM store WHERE id = :id")
                .param("id", id)
                .query((rs, rowNum) -> {
                    // Convert PgArray to List<String> and List<Integer>
                    Array imagesArray = rs.getArray("ui_images");
                    Array topItemsArray = rs.getArray("top_items");

                    List<String> uiImages = null;
                    List<Integer> topItems = null;

                    if (imagesArray != null) {
                        try {
                            String[] images = (String[]) imagesArray.getArray();
                            uiImages = Arrays.asList(images);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<String>", e);
                        }
                    }

                    if (topItemsArray != null) {
                        try {
                            Integer[] items = (Integer[]) topItemsArray.getArray();
                            topItems = Arrays.asList(items);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<Integer>", e);
                        }
                    }

                    // Construct and return the Store object
                    return new Store(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getInt("ui_type"),
                            rs.getString("ui_font"),
                            rs.getString("ui_font_special"),
                            rs.getString("ui_accent_color"),
                            rs.getString("ui_base_color"),
                            rs.getString("ui_secondary_color"),
                            rs.getString("banner"),
                            rs.getString("banner_subtext"),
                            rs.getString("logo_url"),
                            uiImages,
                            topItems
                    );
                })
                .optional(); 
    }
    
    public List<Store> findByName(String name) {
        return jdbcClient.sql("SELECT * FROM store WHERE name LIKE :name")
                .param("name", "%" + name + "%")  // Use wildcards to match substring
                .query((rs, rowNum) -> {
                    // Convert PgArray to List<String> and List<Integer>
                    Array imagesArray = rs.getArray("ui_images");
                    Array topItemsArray = rs.getArray("top_items");

                    List<String> uiImages = null;
                    List<Integer> topItems = null;

                    if (imagesArray != null) {
                        try {
                            String[] images = (String[]) imagesArray.getArray();
                            uiImages = Arrays.asList(images);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<String>", e);
                        }
                    }

                    if (topItemsArray != null) {
                        try {
                            Integer[] items = (Integer[]) topItemsArray.getArray();
                            topItems = Arrays.asList(items);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<Integer>", e);
                        }
                    }

                    // Construct and return the Store object
                    return new Store(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getInt("ui_type"),
                            rs.getString("ui_font"),
                            rs.getString("ui_font_special"),
                            rs.getString("ui_accent_color"),
                            rs.getString("ui_base_color"),
                            rs.getString("ui_secondary_color"),
                            rs.getString("banner"),
                            rs.getString("banner_subtext"),
                            rs.getString("logo_url"),
                            uiImages,
                            topItems
                    );
                })
                .list();  // Return the list of matching stores
    }    

    public void create(Store store) {
        jdbcClient.sql("INSERT INTO store (name, ui_type, ui_font, ui_font_special, ui_accent_color, ui_base_color, ui_secondary_color, banner, banner_subtext, logo_url, ui_images, top_items) " +
                "VALUES (:name, :ui_type, :ui_font, :ui_font_special, :ui_accent_color, :ui_base_color, :ui_secondary_color, :banner, :banner_subtext, :logo_url, :ui_images, :top_items)")
                .param("name", store.name())
                .param("ui_type", store.ui_type())
                .param("ui_font", store.ui_font())
                .param("ui_font_special", store.ui_font_special())
                .param("ui_accent_color", store.ui_accent_color())
                .param("ui_base_color", store.ui_base_color())
                .param("ui_secondary_color", store.ui_secondary_color())
                .param("banner", store.banner())
                .param("banner_subtext", store.banner_subtext())
                .param("logo_url", store.logo_url())
                .param("ui_images", store.ui_images().toArray(new String[0])) // Converts List<String> to String array
                .param("top_items", store.top_items().toArray(new Integer[0])) // Converts List<Integer> to Integer array
                .update();
    }

    public void update(Store store, Integer id) {
        jdbcClient.sql(
                "UPDATE store SET name = :name, ui_type = :ui_type, ui_font = :ui_font, ui_font_special = :ui_font_special, ui_accent_color = :ui_accent_color, ui_base_color = :ui_base_color, ui_secondary_color = :ui_secondary_color, banner = :banner, banner_subtext = :banner_subtext, logo_url = :logo_url, ui_images = :ui_images, top_items = :top_items WHERE id = :id")
                .param("id", id)
                .param("name", store.name())
                .param("ui_type", store.ui_type())
                .param("ui_font", store.ui_font())
                .param("ui_font_special", store.ui_font_special())
                .param("ui_accent_color", store.ui_accent_color())
                .param("ui_base_color", store.ui_base_color())
                .param("ui_secondary_color", store.ui_secondary_color())
                .param("banner", store.banner())
                .param("banner_subtext", store.banner_subtext())
                .param("logo_url", store.logo_url())
                .param("ui_images", store.ui_images().toArray(new String[0])) // Converts List<String> to String array
                .param("top_items", store.top_items().toArray(new Integer[0])) // Converts List<Integer> to Integer array
                .update();
    }

    public void delete(Integer id) {
        jdbcClient.sql("DELETE FROM store WHERE id = :id")
                .param("id", id)
                .update();
    }
}
