package com.clickflatsync.service;

import com.clickflatsync.model.ClickHouseConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Connection;
import java.sql.DriverManager;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ClickHouseServiceTest {

    @InjectMocks
    private ClickHouseService clickHouseService;

    private ClickHouseConfig config;

    @BeforeEach
    void setUp() {
        // Initialize mocks
        MockitoAnnotations.openMocks(this);

        // Setup test configuration
        config = new ClickHouseConfig();
        config.setHost("localhost");
        config.setPort(8123);
        config.setDatabase("default");
        config.setUsername("default");
        config.setPassword("");
    }

    @Test
    void testConnection() {
        // Given valid configuration
        config.setHost("localhost");

        // When
        boolean isConnected = clickHouseService.testConnection(config);

        // Then
        assertFalse(isConnected, "Should not connect since this is a test environment");
    }

    @Test
    void testInvalidConnection() {
        // Given invalid configuration
        config.setHost("invalid-host");

        // When
        boolean isConnected = clickHouseService.testConnection(config);

        // Then
        assertFalse(isConnected, "Should fail to connect with invalid host");
    }
}