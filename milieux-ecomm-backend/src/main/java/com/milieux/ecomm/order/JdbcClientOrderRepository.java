package com.milieux.ecomm.order;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.sql.Array;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class JdbcClientOrderRepository {

    private final JdbcClient jdbcClient;
    private static final Logger log = LoggerFactory.getLogger(JdbcClientOrderRepository.class);

    public JdbcClientOrderRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    private List<Integer> convertArrayToList(Array array) {
        if (array == null) {
            return List.of();
        }

        try {
            Integer[] arrayElements = (Integer[]) array.getArray();
            return Arrays.stream(arrayElements).collect(Collectors.toList());
        } catch (SQLException e) {
            throw new RuntimeException("Error converting SQL Array to List<Integer>", e);
        }
    }

    public List<Order> findAll() {
        return jdbcClient.sql("SELECT * FROM orders")
                .query((rs, rowNum) -> {
                    // Convert SQL arrays to List<Integer> for product_ids and product_quantities
                    Array productIdsArray = rs.getArray("product_ids");
                    Array productQuantitiesArray = rs.getArray("product_quantities");

                    List<Integer> productIds = convertArrayToList(productIdsArray);
                    List<Integer> productQuantities = convertArrayToList(productQuantitiesArray);

                    // Construct and return the Order object
                    return new Order(
                            rs.getInt("id"),
                            rs.getInt("user_id"),
                            rs.getInt("store_id"),
                            productIds,
                            productQuantities,
                            rs.getString("address"),
                            rs.getTimestamp("timestamp").toLocalDateTime(), // Convert SQL Timestamp to LocalDateTime
                            rs.getInt("status"));
                })
                .list(); // Return the list of all orders
    }

    public Optional<Order> findById(Integer id) {
        System.out.println("Finding order with ID " + id);
        try {
            return jdbcClient.sql("SELECT * FROM orders WHERE id = :id")
                    .param("id", id)
                    .query((rs, rowNum) -> {
                        // Convert SQL arrays to List<Integer> for product_ids and product_quantities
                        Array productIdsArray = rs.getArray("product_ids");
                        Array productQuantitiesArray = rs.getArray("product_quantities");

                        List<Integer> productIds = convertArrayToList(productIdsArray);
                        List<Integer> productQuantities = convertArrayToList(productQuantitiesArray);

                        // Construct and return the Order object
                        return new Order(
                                rs.getInt("id"),
                                rs.getInt("user_id"),
                                rs.getInt("store_id"),
                                productIds,
                                productQuantities,
                                rs.getString("address"),
                                rs.getTimestamp("timestamp").toLocalDateTime(), // Convert SQL Timestamp to
                                                                                // LocalDateTime
                                rs.getInt("status"));
                    })
                    .optional()
                    .map(order -> {
                        log.info("Found order: {}", order);
                        return order;
                    });
        } catch (Exception e) {
            log.error("Error fetching order with ID " + id, e);
            return Optional.empty();
        }
    }

    public List<Order> findByUserId(Integer userId) {
        return jdbcClient.sql("SELECT * FROM orders WHERE user_id = :user_id")
                .param("user_id", userId)
                .query((rs, rowNum) -> {
                    // Convert SQL arrays to List<Integer> for product_ids and product_quantities
                    Array productIdsArray = rs.getArray("product_ids");
                    Array productQuantitiesArray = rs.getArray("product_quantities");

                    List<Integer> productIds = null;
                    List<Integer> productQuantities = null;

                    if (productIdsArray != null) {
                        try {
                            Integer[] ids = (Integer[]) productIdsArray.getArray();
                            productIds = Arrays.asList(ids);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<Integer> for product_ids",
                                    e);
                        }
                    }

                    if (productQuantitiesArray != null) {
                        try {
                            Integer[] quantities = (Integer[]) productQuantitiesArray.getArray();
                            productQuantities = Arrays.asList(quantities);
                        } catch (SQLException e) {
                            throw new RuntimeException(
                                    "Error converting SQL Array to List<Integer> for product_quantities", e);
                        }
                    }

                    // Construct and return the Order object
                    return new Order(
                            rs.getInt("id"),
                            rs.getInt("user_id"),
                            rs.getInt("store_id"),
                            productIds,
                            productQuantities,
                            rs.getString("address"),
                            rs.getTimestamp("timestamp").toLocalDateTime(), // Convert SQL Timestamp to LocalDateTime
                            rs.getInt("status"));
                })
                .list(); // Return the list of matching orders
    }

    public List<Order> findByStoreId(Integer storeId) {
        return jdbcClient.sql("SELECT * FROM orders WHERE store_id = :store_id")
                .param("store_id", storeId)
                .query((rs, rowNum) -> {
                    // Convert SQL arrays to List<Integer> for product_ids and product_quantities
                    Array productIdsArray = rs.getArray("product_ids");
                    Array productQuantitiesArray = rs.getArray("product_quantities");

                    List<Integer> productIds = null;
                    List<Integer> productQuantities = null;

                    if (productIdsArray != null) {
                        try {
                            Integer[] ids = (Integer[]) productIdsArray.getArray();
                            productIds = Arrays.asList(ids);
                        } catch (SQLException e) {
                            throw new RuntimeException("Error converting SQL Array to List<Integer> for product_ids",
                                    e);
                        }
                    }

                    if (productQuantitiesArray != null) {
                        try {
                            Integer[] quantities = (Integer[]) productQuantitiesArray.getArray();
                            productQuantities = Arrays.asList(quantities);
                        } catch (SQLException e) {
                            throw new RuntimeException(
                                    "Error converting SQL Array to List<Integer> for product_quantities", e);
                        }
                    }

                    // Construct and return the Order object
                    return new Order(
                            rs.getInt("id"),
                            rs.getInt("user_id"),
                            rs.getInt("store_id"),
                            productIds,
                            productQuantities,
                            rs.getString("address"),
                            rs.getTimestamp("timestamp").toLocalDateTime(), // Convert SQL Timestamp to LocalDateTime
                            rs.getInt("status"));
                })
                .list();
    }

    public void create(Order order) {
        // Convert the lists of product IDs and quantities to arrays
        Integer[] productIdsArray = order.product_ids().toArray(new Integer[0]);
        Integer[] productQuantitiesArray = order.product_quantities().toArray(new Integer[0]);

        var updated = jdbcClient.sql(
                "INSERT INTO orders (id, user_id, store_id, product_ids, product_quantities, address, timestamp, status) "
                        +
                        "VALUES (:id, :user_id, :store_id, :product_ids, :product_quantities, :address, :timestamp, :status)")
                .param("id", order.id())
                .param("user_id", order.user_id())
                .param("store_id", order.store_id())
                .param("product_ids", productIdsArray) // Pass the Integer array
                .param("product_quantities", productQuantitiesArray) // Pass the Integer array
                .param("address", order.address())
                .param("timestamp", order.timestamp())
                .param("status", order.status())
                .update();

        Assert.state(updated == 1, "Failed to create order with ID: " + order.id());
    }

    public void update(Order order, Integer id) {
        var updated = jdbcClient.sql(
                "UPDATE orders SET user_id = :user_id, store_id = :store_id, product_ids = :product_ids, " +
                        "product_quantities = :product_quantities, address = :address, timestamp = :timestamp, status = :status "
                        +
                        "WHERE id = :id")
                .param("id", id)
                .param("user_id", order.user_id())
                .param("store_id", order.store_id())
                .param("product_ids", order.product_ids())
                .param("product_quantities", order.product_quantities())
                .param("address", order.address())
                .param("timestamp", order.timestamp())
                .param("status", order.status())
                .update();
        Assert.state(updated == 1, "Failed to update order with ID: " + order.id());
    }

    public int getTotalOrders(Integer id) {
        return jdbcClient.sql("SELECT COUNT(*) FROM orders WHERE store_id = :id")
                .param("id", id) // Bind the store_id to the query
                .query((rs, rowNum) -> rs.getInt(1)) // Extract the count from the result set
                .single(); // Return the single result (the count)
    }
    
    public void ship(Integer id) {
        var updated = jdbcClient.sql("UPDATE orders SET status = 1 WHERE id = :id")
                .param("id", id)
                .update();
        Assert.state(updated == 1, "Failed to ship order with ID: " + id);
    }

}
