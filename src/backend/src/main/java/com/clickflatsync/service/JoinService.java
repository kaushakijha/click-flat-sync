package com.clickflatsync.service;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.IngestionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.FileWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.List;

@Slf4j
@Service
public class JoinService {
    private final ClickHouseService clickHouseService;

    public JoinService(ClickHouseService clickHouseService) {
        this.clickHouseService = clickHouseService;
    }

    public IngestionResponse executeJoin(
            ClickHouseConfig config,
            List<String> tables,
            List<String> joinConditions,
            List<String> selectedColumns,
            String outputFile) {

        IngestionResponse response = new IngestionResponse();

        // Validate input parameters
        if (tables == null || tables.size() < 2) {
            response.setError("At least two tables are required for a join operation");
            return response;
        }

        if (joinConditions == null || joinConditions.isEmpty()) {
            response.setError("Join conditions cannot be empty");
            return response;
        }

        if (selectedColumns == null || selectedColumns.isEmpty()) {
            response.setError("Selected columns cannot be empty");
            return response;
        }

        if (!StringUtils.hasText(outputFile)) {
            response.setError("Output file path cannot be empty");
            return response;
        }

        int recordCount = 0;
        FileWriter writer = null;

        try {
            // Build the JOIN query
            StringBuilder queryBuilder = new StringBuilder();
            queryBuilder.append("SELECT ").append(String.join(", ", selectedColumns))
                    .append(" FROM ").append(config.getDatabase()).append(".").append(tables.get(0));

            for (int i = 1; i < tables.size(); i++) {
                queryBuilder.append(" JOIN ")
                        .append(config.getDatabase()).append(".")
                        .append(tables.get(i))
                        .append(" ON ").append(joinConditions.get(i - 1));
            }

            String query = queryBuilder.toString();
            log.info("Executing join query: {}", query);

            try (Connection connection = clickHouseService.connect(config);
                    Statement statement = connection.createStatement();
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
                        writer.append(value != null ? value.replace(",", ";") : "");
                        writer.append(i < columnCount ? "," : "\n");
                    }
                    recordCount++;
                }
            }

            response.setRecordCount(recordCount);
            response.setMessage("Successfully joined tables and exported " + recordCount + " records");
            response.setSuccess(true);

        } catch (Exception e) {
            log.error("Error executing join operation", e);
            response.setError("Failed to execute join: " + e.getMessage());
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
}