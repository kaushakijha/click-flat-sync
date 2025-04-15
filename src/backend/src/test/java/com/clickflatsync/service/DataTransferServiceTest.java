package com.clickflatsync.service;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.FlatFileConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DataTransferServiceTest {

    @Mock
    private ClickHouseService clickHouseService;

    @InjectMocks
    private DataTransferService dataTransferService;

    private ClickHouseConfig config;
    private static final String TEST_TABLE = "test_table";
    private static final String TEST_CSV = "test_export.csv";

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
    void testExportToCSV() {
        // Given
        FlatFileConfig fileConfig = new FlatFileConfig();
        fileConfig.setTableName(TEST_TABLE);
        fileConfig.setOutputFile(TEST_CSV);
        List<String> columns = Arrays.asList("id", "name", "value");
        fileConfig.setSelectedColumns(columns);

        // Mock successful export
        when(clickHouseService.exportToCSV(any(), any())).thenReturn(true);

        // When
        boolean success = dataTransferService.exportToCSV(config, fileConfig);

        // Then
        assertTrue(success, "Export should be successful");
        verify(clickHouseService).exportToCSV(config, fileConfig);
    }

    @Test
    void testImportFromCSV() {
        // Given
        String importTable = TEST_TABLE + "_import";
        FlatFileConfig fileConfig = new FlatFileConfig();
        fileConfig.setTableName(importTable);
        fileConfig.setInputFile(TEST_CSV);
        List<String> columns = Arrays.asList("id", "name", "value");
        fileConfig.setColumns(columns);

        // Mock successful import
        when(clickHouseService.importFromCSV(any(), any())).thenReturn(true);

        // When
        boolean success = dataTransferService.importFromCSV(config, fileConfig);

        // Then
        assertTrue(success, "Import should be successful");
        verify(clickHouseService).importFromCSV(config, fileConfig);
    }

    @Test
    void testExportToCSVFailure() {
        // Given
        FlatFileConfig fileConfig = new FlatFileConfig();
        fileConfig.setTableName(TEST_TABLE);
        fileConfig.setOutputFile(TEST_CSV);
        List<String> columns = Arrays.asList("id", "name", "value");
        fileConfig.setSelectedColumns(columns);

        // Mock failed export
        when(clickHouseService.exportToCSV(any(), any())).thenReturn(false);

        // When
        boolean success = dataTransferService.exportToCSV(config, fileConfig);

        // Then
        assertFalse(success, "Export should fail");
        verify(clickHouseService).exportToCSV(config, fileConfig);
    }

    @Test
    void testImportFromCSVFailure() {
        // Given
        String importTable = TEST_TABLE + "_import";
        FlatFileConfig fileConfig = new FlatFileConfig();
        fileConfig.setTableName(importTable);
        fileConfig.setInputFile(TEST_CSV);
        List<String> columns = Arrays.asList("id", "name", "value");
        fileConfig.setColumns(columns);

        // Mock failed import
        when(clickHouseService.importFromCSV(any(), any())).thenReturn(false);

        // When
        boolean success = dataTransferService.importFromCSV(config, fileConfig);

        // Then
        assertFalse(success, "Import should fail");
        verify(clickHouseService).importFromCSV(config, fileConfig);
    }
}