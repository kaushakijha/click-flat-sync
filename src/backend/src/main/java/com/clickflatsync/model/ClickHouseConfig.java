package com.clickflatsync.model;

import lombok.Data;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;

@Data
public class ClickHouseConfig {
    @NotBlank(message = "Host is required")
    private String host;

    @Min(value = 1, message = "Port must be greater than 0")
    private int port;

    @NotBlank(message = "Database is required")
    private String database;

    @NotBlank(message = "Username is required")
    private String username;

    private String password;

    private String jwtToken;

    private String tableName; // Added for table operations
}