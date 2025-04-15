package com.clickflatsync.service;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.IngestionResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JoinServiceTest {

        @Mock
        private ClickHouseService clickHouseService;

        @Mock
        private Connection connection;

        @Mock
        private Statement statement;

        @Mock
        private ResultSet resultSet;

        @Mock
        private ResultSetMetaData metaData;

        @InjectMocks
        private JoinService joinService;

        private ClickHouseConfig config;
        private static final String TABLE1 = "test_users";
        private static final String TABLE2 = "test_orders";
        private static final String OUTPUT_FILE = "join_result.csv";

        @BeforeEach
        void setUp() throws Exception {
                // Initialize mocks
                MockitoAnnotations.openMocks(this);

                // Setup test configuration
                config = new ClickHouseConfig();
                config.setHost("localhost");
                config.setPort(8123);
                config.setDatabase("default");
                config.setUsername("default");
                config.setPassword("");

                // Mock ClickHouseService behavior
                when(clickHouseService.connect(any())).thenReturn(connection);
                when(connection.createStatement()).thenReturn(statement);
                when(statement.executeQuery(any())).thenReturn(resultSet);
                when(resultSet.getMetaData()).thenReturn(metaData);
                when(metaData.getColumnCount()).thenReturn(3);
                when(metaData.getColumnName(1)).thenReturn("username");
                when(metaData.getColumnName(2)).thenReturn("order_id");
                when(metaData.getColumnName(3)).thenReturn("amount");
                when(resultSet.next()).thenReturn(true, true, false);
                when(resultSet.getString(1)).thenReturn("user1", "user2");
                when(resultSet.getString(2)).thenReturn("1", "2");
                when(resultSet.getString(3)).thenReturn("100.50", "200.75");
        }

        @Test
        void testJoinTables() throws Exception {
                // Given
                List<String> tables = Arrays.asList(TABLE1, TABLE2);
                List<String> joinConditions = Arrays.asList(TABLE1 + ".user_id = " + TABLE2 + ".user_id");
                List<String> selectedColumns = Arrays.asList(
                                TABLE1 + ".username",
                                TABLE2 + ".order_id",
                                TABLE2 + ".amount");

                // When
                IngestionResponse response = joinService.executeJoin(
                                config,
                                tables,
                                joinConditions,
                                selectedColumns,
                                OUTPUT_FILE);

                // Then
                assertNotNull(response, "Response should not be null");
                assertNull(response.getError(), "Should not have any errors");
                assertTrue(response.isSuccess(), "Operation should be successful");
                assertEquals(2, response.getRecordCount(), "Should have 2 records");
                verify(clickHouseService).connect(config);
        }

        @Test
        void testJoinTablesWithInvalidCondition() throws Exception {
                // Given
                List<String> tables = Arrays.asList(TABLE1, TABLE2);
                List<String> joinConditions = Arrays.asList("invalid_condition");
                List<String> selectedColumns = Arrays.asList("*");

                // Mock exception for invalid condition
                when(statement.executeQuery(any())).thenThrow(new RuntimeException("Invalid join condition"));

                // When
                IngestionResponse response = joinService.executeJoin(
                                config,
                                tables,
                                joinConditions,
                                selectedColumns,
                                OUTPUT_FILE);

                // Then
                assertNotNull(response, "Response should not be null");
                assertNotNull(response.getError(), "Should have an error");
                assertFalse(response.isSuccess(), "Operation should not be successful");
                verify(clickHouseService).connect(config);
        }

        @Test
        void testJoinTablesWithConnectionFailure() throws Exception {
                // Given
                List<String> tables = Arrays.asList(TABLE1, TABLE2);
                List<String> joinConditions = Arrays.asList(TABLE1 + ".user_id = " + TABLE2 + ".user_id");
                List<String> selectedColumns = Arrays.asList("*");

                // Mock connection failure
                when(clickHouseService.connect(any())).thenThrow(new RuntimeException("Connection failed"));

                // When
                IngestionResponse response = joinService.executeJoin(
                                config,
                                tables,
                                joinConditions,
                                selectedColumns,
                                OUTPUT_FILE);

                // Then
                assertNotNull(response, "Response should not be null");
                assertNotNull(response.getError(), "Should have an error");
                assertFalse(response.isSuccess(), "Operation should not be successful");
                verify(clickHouseService).connect(config);
        }
}