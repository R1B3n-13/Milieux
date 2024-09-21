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
                            rs.getString("category"),
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
                            topItems);
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
                            rs.getString("category"),
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
                            topItems);
                })
                .optional();
    }

    public List<Store> findByName(String name) {
        return jdbcClient.sql("SELECT * FROM store WHERE name LIKE :name")
                .param("name", "%" + name + "%") // Use wildcards to match substring
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
                            rs.getString("category"),
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
                            topItems);
                })
                .list(); // Return the list of matching stores
    }

    public void create(Integer id, String name, String category) {
        // System.out.println(name + ' ' + category);
        jdbcClient.sql(
                "INSERT INTO store (id, name, category) VALUES (:id, :name, :category)")
                .param("id", id)
                .param("name", name)
                .param("category", category)
                .update();
    }

    public void delete(Integer id) {
        jdbcClient.sql("DELETE FROM store WHERE id = :id")
                .param("id", id)
                .update();
    }

    public void updateUiImages(Integer id, List<String> images) {

        String imagesArray = "{" + String.join(",", images.stream()
                .map(image -> "\"" + image.replace("\"", "\\\"") + "\"")
                .toArray(String[]::new)) + "}";

        System.out.println(imagesArray);

        // Update the ui_images column in the store table
        jdbcClient.sql("UPDATE store SET ui_images = CAST(:ui_images AS text[]) WHERE id = :id")
                .param("id", id)
                .param("ui_images", imagesArray)
                .update();
    }

    public void updateUiType(Integer id, Integer uiType) {
        System.out.println(uiType);
        jdbcClient.sql("UPDATE store SET ui_type = :ui_type WHERE id = :id")
                .param("id", id)
                .param("ui_type", uiType)
                .update();
    }

    public void updateTopProducts(Integer id, List<Integer> products) {
        jdbcClient.sql("UPDATE store SET top_items = :top_items WHERE id = :id")
                .param("id", id)
                .param("top_items", products.toArray(new Integer[0])) // Converts List<Integer> to Integer array
                .update();
    }

    public void updateName(Integer id, String name) {
        jdbcClient.sql("UPDATE store SET name = :name WHERE id = :id")
                .param("id", id)
                .param("name", name)
                .update();
    }

    public void updateLogo(Integer id, String url) {
        jdbcClient.sql("UPDATE store SET logo_url = :url WHERE id = :id")
                .param("id", id)
                .param("url", url)
                .update();
    }

    public void updateBanner(Integer id, String url) {
        jdbcClient.sql("UPDATE store SET banner = :url WHERE id = :id")
                .param("id", id)
                .param("url", url)
                .update();
    }

    public void updateSubtext(Integer id, String subtext) {
        jdbcClient.sql("UPDATE store SET banner_subtext = :subtext WHERE id = :id")
                .param("id", id)
                .param("subtext", subtext)
                .update();
    }

    public void updateColors(Integer id, String baseColor, String secondaryColor, String accentColor) {
        jdbcClient.sql("UPDATE store SET ui_base_color = :base_color, ui_secondary_color = :secondary_color, ui_accent_color = :accent_color WHERE id = :id")
                .param("id", id)
                .param("base_color", baseColor)
                .param("secondary_color", secondaryColor)
                .param("accent_color", accentColor)
                .update();
    }
}
