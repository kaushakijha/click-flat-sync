package com.dataingest.service;

import com.dataingest.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.StringJoiner;

@Service
public class DataTransferService {
    private static final Logger logger = LoggerFactory.getLogger(DataTransferService.class);
    
    @Autowired
    private ClickHouseService clickHouseService;
    
    @Autowired
    private FlatFileService flatFileService;
    
    public IngestionResponse transferClickHouseToFlatFile(
            ClickHouseConfig clickHouseConfig, 
            FlatFileConfig flatFileConfig, 
            String tableName, 
            List<String> columns) throws Exception {
        
        logger.info("Starting ClickHouse to Flat File transfer for table: {}", tableName);
        logger.info("Selected columns: {}", columns);
        
        IngestionResponse response = new IngestionResponse();
        
        try (Connection connection = getClickHouseConnection(clickHouseConfig);
             BufferedWriter writer = new BufferedWriter(new FileWriter(flatFileConfig.getFileName()))) {
            
            logger.info("Connected to ClickHouse successfully");
            
            // Build query
            StringBuilder queryBuilder = new StringBuilder("SELECT ");
            for (int i = 0; i < columns.size(); i++) {
                queryBuilder.append(columns.get(i));
                if (i < columns.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(" FROM ").append(tableName);
            
            // Execute query
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(queryBuilder.toString());
            
            // Write header line
            StringJoiner headerJoiner = new StringJoiner(flatFileConfig.getDelimiter());
            for (String column : columns) {
                headerJoiner.add(column);
            }
            writer.write(headerJoiner.toString());
            writer.newLine();
            
            // Write data rows
            long recordCount = 0;
            while (rs.next()) {
                StringJoiner rowJoiner = new StringJoiner(flatFileConfig.getDelimiter());
                for (String column : columns) {
                    String value = rs.getString(column);
                    rowJoiner.add(value != null ? value : "");
                }
                writer.write(rowJoiner.toString());
                writer.newLine();
                recordCount++;
            }
            
            logger.info("Transfer completed successfully. Records processed: {}", recordCount);
            response.setSuccess(true);
            response.setRecordCount(recordCount);
            return response;
        } catch (Exception e) {
            logger.error("Transfer failed: {}", e.getMessage(), e);
            response.setSuccess(false);
            response.setError("Transfer failed: " + e.getMessage());
            throw e;
        }
    }
    
    public IngestionResponse transferFlatFileToClickHouse(
            FlatFileConfig flatFileConfig, 
            ClickHouseConfig clickHouseConfig, 
            String tableName, 
            List<String> columns) throws Exception {
        
        logger.info("Starting Flat File to ClickHouse transfer to table: {}", tableName);
        logger.info("Selected columns: {}", columns);
        
        IngestionResponse response = new IngestionResponse();
        
        try (Connection connection = getClickHouseConnection(clickHouseConfig);
             BufferedReader reader = new BufferedReader(new FileReader(flatFileConfig.getFileName()))) {
            
            logger.info("Connected to ClickHouse successfully");
            
            // Read header line to map columns
            String headerLine = reader.readLine();
            if (headerLine == null) {
                response.setSuccess(false);
                response.setError("Empty file");
                return response;
            }
            
            String[] headers = headerLine.split(flatFileConfig.getDelimiter());
            Map<String, Integer> columnMap = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                columnMap.put(headers[i].trim(), i);
            }
            
            // Check if the table exists, create if not
            Statement stmt = connection.createStatement();
            try {
                stmt.executeQuery("SELECT 1 FROM " + tableName + " LIMIT 1");
            } catch (Exception e) {
                // Table doesn't exist, create it
                StringBuilder createTableBuilder = new StringBuilder();
                createTableBuilder.append("CREATE TABLE ").append(tableName).append(" (");
                
                for (int i = 0; i < columns.size(); i++) {
                    String column = columns.get(i);
                    createTableBuilder.append(column).append(" String");
                    if (i < columns.size() - 1) {
                        createTableBuilder.append(", ");
                    }
                }
                
                createTableBuilder.append(") ENGINE = MergeTree() ORDER BY tuple()");
                stmt.execute(createTableBuilder.toString());
            }
            
            // Prepare insert statement
            StringBuilder insertBuilder = new StringBuilder();
            insertBuilder.append("INSERT INTO ").append(tableName).append(" (");
            for (int i = 0; i < columns.size(); i++) {
                insertBuilder.append(columns.get(i));
                if (i < columns.size() - 1) {
                    insertBuilder.append(", ");
                }
            }
            insertBuilder.append(") VALUES (");
            for (int i = 0; i < columns.size(); i++) {
                insertBuilder.append("?");
                if (i < columns.size() - 1) {
                    insertBuilder.append(", ");
                }
            }
            insertBuilder.append(")");
            
            PreparedStatement pstmt = connection.prepareStatement(insertBuilder.toString());
            
            // Insert data in batches
            String line;
            long recordCount = 0;
            final int BATCH_SIZE = 1000;
            int batchCount = 0;
            
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(flatFileConfig.getDelimiter(), -1);
                
                for (int i = 0; i < columns.size(); i++) {
                    String column = columns.get(i);
                    Integer index = columnMap.get(column);
                    
                    if (index != null && index < values.length) {
                        pstmt.setString(i + 1, values[index]);
                    } else {
                        pstmt.setString(i + 1, "");
                    }
                }
                
                pstmt.addBatch();
                batchCount++;
                
                if (batchCount >= BATCH_SIZE) {
                    pstmt.executeBatch();
                    batchCount = 0;
                }
                
                recordCount++;
            }
            
            // Execute any remaining batch
            if (batchCount > 0) {
                pstmt.executeBatch();
            }
            
            logger.info("Transfer completed successfully. Records processed: {}", recordCount);
            response.setSuccess(true);
            response.setRecordCount(recordCount);
            return response;
        } catch (Exception e) {
            logger.error("Transfer failed: {}", e.getMessage(), e);
            response.setSuccess(false);
            response.setError("Transfer failed: " + e.getMessage());
            throw e;
        }
    }
    
    private Connection getClickHouseConnection(ClickHouseConfig config) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("user", config.getUser());
        properties.setProperty("password", config.getJwtToken());
        
        // Check if using HTTPS port
        boolean useSSL = config.getPort().equals("9440") || config.getPort().equals("8443");
        if (useSSL) {
            properties.setProperty("ssl", "true");
            properties.setProperty("sslmode", "STRICT");
        }
        
        String url = "jdbc:clickhouse://" + config.getHost() + ":" + config.getPort() + "/" + config.getDatabase();
        return DriverManager.getConnection(url, properties);
    }
}
