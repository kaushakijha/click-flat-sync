package com.clickflatsync.service;

import com.clickflatsync.model.ColumnInfo;
import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.FlatFileConfig;
import com.clickflatsync.model.IngestionResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FileWriter;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Slf4j
@Service
public class ClickHouseService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, String> CLICKHOUSE_TYPE_MAPPING = new HashMap<>();
    private static final int BATCH_SIZE = 10000;

    static {
        CLICKHOUSE_TYPE_MAPPING.put("INT", "Int32");
        CLICKHOUSE_TYPE_MAPPING.put("BIGINT", "Int64");
        CLICKHOUSE_TYPE_MAPPING.put("FLOAT", "Float32");
        CLICKHOUSE_TYPE_MAPPING.put("DOUBLE", "Float64");
        CLICKHOUSE_TYPE_MAPPING.put("DECIMAL", "Decimal(18,2)");
        CLICKHOUSE_TYPE_MAPPING.put("VARCHAR", "String");
        CLICKHOUSE_TYPE_MAPPING.put("CHAR", "String");
        CLICKHOUSE_TYPE_MAPPING.put("TEXT", "String");
        CLICKHOUSE_TYPE_MAPPING.put("DATE", "Date");
        CLICKHOUSE_TYPE_MAPPING.put("TIMESTAMP", "DateTime");
        CLICKHOUSE_TYPE_MAPPING.put("BOOLEAN", "UInt8");
    }

    private String mapToClickHouseType(String sourceType) {
        String upperType = sourceType.toUpperCase();
        for (Map.Entry<String, String> entry : CLICKHOUSE_TYPE_MAPPING.entrySet()) {
            if (upperType.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "String"; // default type
    }

    public Connection connect(ClickHouseConfig config) throws Exception {
        if (config == null) {
            throw new IllegalArgumentException("Configuration cannot be null");
        }

        validateConfig(config);

        String url = String.format("jdbc:clickhouse://%s:%d/%s",
                config.getHost(),
                config.getPort(),
                config.getDatabase());

        Properties properties = new Properties();
        properties.setProperty("user", config.getUsername());

        if (StringUtils.hasText(config.getPassword())) {
            properties.setProperty("password", config.getPassword());
        }

        if (StringUtils.hasText(config.getJwtToken())) {
            properties.setProperty("jwt_token", config.getJwtToken());
        }

        try {
            return DriverManager.getConnection(url, properties);
        } catch (SQLException e) {
            log.error("Failed to connect to ClickHouse: {}", e.getMessage());
            throw new Exception("Failed to connect to ClickHouse: " + e.getMessage());
        }
    }

    private void validateConfig(ClickHouseConfig config) {
        List<String> errors = new ArrayList<>();

        if (!StringUtils.hasText(config.getHost())) {
            errors.add("Host cannot be empty");
        }
        if (config.getPort() <= 0) {
            errors.add("Invalid port number");
        }
        if (!StringUtils.hasText(config.getDatabase())) {
            errors.add("Database name cannot be empty");
        }
        if (!StringUtils.hasText(config.getUsername())) {
            errors.add("Username cannot be empty");
        }

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Invalid configuration: " + String.join(", ", errors));
        }
    }

    public ResultSet executeQuery(ClickHouseConfig config, String query) throws Exception {
        Connection connection = connect(config);
        Statement statement = connection.createStatement();
        return statement.executeQuery(query);
    }

    public String executeQueryAndGetString(ClickHouseConfig config, String query) throws Exception {
        try (ResultSet resultSet = executeQuery(config, query)) {
            if (resultSet.next()) {
                return resultSet.getString(1);
            }
            return "0";
        }
    }

    public boolean exportToCSV(ClickHouseConfig config, FlatFileConfig fileConfig) {
        try {
            String columnList = String.join(", ", fileConfig.getSelectedColumns());
            String query = String.format("SELECT %s FROM %s.%s",
                    columnList,
                    config.getDatabase(),
                    fileConfig.getTableName());

            try (Connection connection = connect(config);
                    Statement statement = connection.createStatement();
                    ResultSet resultSet = statement.executeQuery(query)) {

                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                try (FileWriter writer = new FileWriter(fileConfig.getOutputFile())) {
                    // Write header
                    for (int i = 1; i <= columnCount; i++) {
                        writer.append(metaData.getColumnName(i));
                        writer.append(i < columnCount ? "," : "\n");
                    }

                    // Write data
                    while (resultSet.next()) {
                        for (int i = 1; i <= columnCount; i++) {
                            String value = resultSet.getString(i);
                            writer.append(value != null ? value.replace(",", ";") : "");
                            writer.append(i < columnCount ? "," : "\n");
                        }
                    }
                }
            }
            return true;
        } catch (Exception e) {
            log.error("Error exporting to CSV", e);
            return false;
        }
    }

    public boolean importFromCSV(ClickHouseConfig config, FlatFileConfig fileConfig) {
        try {
            // Create table if not exists
            StringBuilder createTableQuery = new StringBuilder()
                    .append("CREATE TABLE IF NOT EXISTS ")
                    .append(config.getDatabase())
                    .append(".")
                    .append(fileConfig.getTableName())
                    .append(" (");

            for (int i = 0; i < fileConfig.getColumns().size(); i++) {
                String column = fileConfig.getColumns().get(i);
                createTableQuery.append(column)
                        .append(" String"); // Default to String type for simplicity

                if (i < fileConfig.getColumns().size() - 1) {
                    createTableQuery.append(", ");
                }
            }

            createTableQuery.append(") ENGINE = MergeTree() ORDER BY tuple()");

            try (Connection connection = connect(config);
                    Statement statement = connection.createStatement()) {

                statement.execute(createTableQuery.toString());

                // Import data using ClickHouse's native CSV parser
                String importQuery = String.format(
                        "INSERT INTO %s.%s FORMAT CSVWithNames",
                        config.getDatabase(),
                        fileConfig.getTableName());

                statement.execute(importQuery);
            }
            return true;
        } catch (Exception e) {
            log.error("Error importing from CSV", e);
            return false;
        }
    }

    public List<ColumnInfo> getColumns(ClickHouseConfig config) throws Exception {
        List<ColumnInfo> columns = new ArrayList<>();

        if (!StringUtils.hasText(config.getTableName())) {
            throw new IllegalArgumentException("Table name must be specified");
        }

        try (Connection connection = connect(config)) {
            String query = "SELECT name, type FROM system.columns WHERE database = ? AND table = ?";
            try (PreparedStatement stmt = connection.prepareStatement(query)) {
                stmt.setString(1, config.getDatabase());
                stmt.setString(2, config.getTableName());

                try (ResultSet resultSet = stmt.executeQuery()) {
                    while (resultSet.next()) {
                        columns.add(new ColumnInfo(
                                resultSet.getString("name"),
                                resultSet.getString("type")));
                    }
                }
            }
        }

        return columns;
    }

    public List<String> getTables(ClickHouseConfig config) {
        List<String> tables = new ArrayList<>();
        try (Connection connection = connect(config)) {
            String query = "SELECT name FROM system.tables WHERE database = ?";
            try (PreparedStatement stmt = connection.prepareStatement(query)) {
                stmt.setString(1, config.getDatabase());
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        tables.add(rs.getString("name"));
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch tables: {}", e.getMessage());
        }
        return tables;
    }

    public List<Map<String, Object>> getPreviewData(ClickHouseConfig config, List<String> columns, int limit)
            throws Exception {
        List<Map<String, Object>> previewData = new ArrayList<>();

        try (Connection connection = connect(config)) {
            String columnList = String.join(", ", columns);
            String query = String.format("SELECT %s FROM %s.%s LIMIT %d",
                    columnList,
                    config.getDatabase(),
                    config.getTableName(),
                    limit);

            try (Statement statement = connection.createStatement();
                    ResultSet resultSet = statement.executeQuery(query)) {

                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                while (resultSet.next()) {
                    Map<String, Object> row = new HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metaData.getColumnName(i);
                        Object value = resultSet.getObject(i);
                        row.put(columnName, value);
                    }
                    previewData.add(row);
                }
            }
        }
        return previewData;
    }

    public IngestionResponse exportToFlatFile(ClickHouseConfig config, List<String> selectedColumns,
            String outputFile) {
        IngestionResponse response = new IngestionResponse();

        if (selectedColumns == null || selectedColumns.isEmpty()) {
            response.setError("Selected columns cannot be empty");
            return response;
        }

        if (!StringUtils.hasText(outputFile)) {
            response.setError("Output file path cannot be empty");
            return response;
        }

        if (!StringUtils.hasText(config.getTableName())) {
            response.setError("Table name must be specified");
            return response;
        }

        int recordCount = 0;
        FileWriter writer = null;

        try (Connection connection = connect(config)) {
            String columnList = String.join(", ", selectedColumns);
            String query = String.format("SELECT %s FROM %s.%s",
                    columnList,
                    config.getDatabase(),
                    config.getTableName());

            try (Statement statement = connection.createStatement();
                    ResultSet resultSet = statement.executeQuery(query)) {

                ResultSetMetaData metaData = resultSet.getMetaData();
                int columnCount = metaData.getColumnCount();

                writer = new FileWriter(outputFile);

                // Write header
                for (int i = 1; i <= columnCount; i++) {
                    writer.append(metaData.getColumnName(i));
                    writer.append(i < columnCount ? "," : "\n");
                }

                // Write data
                while (resultSet.next()) {
                    for (int i = 1; i <= columnCount; i++) {
                        String value = resultSet.getString(i);
                        writer.append(value != null ? value : "");
                        writer.append(i < columnCount ? "," : "\n");
                    }
                    recordCount++;
                }
            }

            response.setRecordCount(recordCount);
            response.setMessage("Successfully exported " + recordCount + " records");
            response.setSuccess(true);

        } catch (Exception e) {
            log.error("Error exporting to flat file", e);
            response.setError("Failed to export data: " + e.getMessage());
            response.setSuccess(false);
        } finally {
            if (writer != null) {
                try {
                    writer.close();
                } catch (Exception e) {
                    log.error("Error closing file writer", e);
                }
            }
        }

        return response;
    }

    public IngestionResponse importFromFlatFile(ClickHouseConfig config, String inputFile, List<ColumnInfo> columns) {
        IngestionResponse response = new IngestionResponse();

        if (!StringUtils.hasText(inputFile)) {
            response.setError("Input file path cannot be empty");
            return response;
        }

        if (columns == null || columns.isEmpty()) {
            response.setError("Column definitions cannot be empty");
            return response;
        }

        if (!StringUtils.hasText(config.getTableName())) {
            response.setError("Table name must be specified");
            return response;
        }

        try (Connection connection = connect(config)) {
            // Create table if not exists with proper type mapping
            StringBuilder createTableQuery = new StringBuilder()
                    .append("CREATE TABLE IF NOT EXISTS ")
                    .append(config.getDatabase())
                    .append(".")
                    .append(config.getTableName())
                    .append(" (");

            for (int i = 0; i < columns.size(); i++) {
                ColumnInfo column = columns.get(i);
                createTableQuery.append(column.getName())
                        .append(" ")
                        .append(mapToClickHouseType(column.getType()));

                if (i < columns.size() - 1) {
                    createTableQuery.append(", ");
                }
            }

            createTableQuery.append(") ENGINE = MergeTree() ORDER BY tuple()");

            try (Statement statement = connection.createStatement()) {
                statement.execute(createTableQuery.toString());

                // Count total records for progress tracking
                long totalRecords = java.nio.file.Files.lines(new File(inputFile).toPath()).count() - 1; // exclude
                                                                                                         // header
                long processedRecords = 0;

                // Prepare insert statement
                StringBuilder insertQuery = new StringBuilder()
                        .append("INSERT INTO ")
                        .append(config.getDatabase())
                        .append(".")
                        .append(config.getTableName())
                        .append(" FORMAT CSVWithNames");

                // Process file in batches
                try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(inputFile))) {
                    String header = reader.readLine(); // Skip header
                    StringBuilder batch = new StringBuilder();
                    String line;
                    int batchCount = 0;

                    while ((line = reader.readLine()) != null) {
                        batch.append(line).append("\n");
                        batchCount++;
                        processedRecords++;

                        if (batchCount >= BATCH_SIZE) {
                            // Execute batch insert
                            statement.execute(insertQuery + "\n" + batch.toString());
                            batch.setLength(0);
                            batchCount = 0;

                            // Log progress
                            double progress = (double) processedRecords / totalRecords * 100;
                            log.info("Import progress: {}% ({} of {} records)",
                                    String.format("%.2f", progress), processedRecords, totalRecords);
                        }
                    }

                    // Insert remaining records
                    if (batch.length() > 0) {
                        statement.execute(insertQuery + "\n" + batch.toString());
                    }
                }

                response.setRecordCount((int) processedRecords);
                response.setMessage(String.format("Successfully imported %d records", processedRecords));
                response.setSuccess(true);
            }
        } catch (Exception e) {
            log.error("Error importing from flat file", e);
            response.setError("Failed to import data: " + e.getMessage());
            response.setSuccess(false);
        }

        return response;
    }

    public boolean testConnection(ClickHouseConfig config) {
        try {
            Connection connection = connect(config);
            connection.close();
            return true;
        } catch (Exception e) {
            log.error("Failed to connect to ClickHouse: {}", e.getMessage());
            return false;
        }
    }
}