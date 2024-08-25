package com.milieux.ecomm.order;

import java.sql.Array;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class OrderMapper {

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
}
