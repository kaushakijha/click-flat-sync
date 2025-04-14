package com.dataingest.service;

import com.dataingest.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Service
public class ClickHouseService {
    
    @Autowired
    private JWTService jwtService;
    
    public ConnectionResponse connect(ClickHouseConfig config) throws Exception {
        ConnectionResponse response = new ConnectionResponse();
        
        // Validate JWT token first
        if (!jwtService.validateToken(config.getJwtToken())) {
            response.setSuccess(false);
            response.setError("Invalid or expired JWT token");
            return response;
        }
        
        try (Connection connection = getConnection(config)) {
            // List available tables
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SHOW TABLES");
            
            List<Table> tables = new ArrayList<>();
            while (rs.next()) {
                Table table = new Table();
                table.setName(rs.getString(1));
                tables.add(table);
            }
            
            response.setTables(tables);
            response.setSuccess(true);
            return response;
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("Failed to connect to ClickHouse: " + e.getMessage());
            throw e;
        }
    }
    
    public ConnectionResponse getTableColumns(ClickHouseConfig config, String tableName) throws Exception {
        ConnectionResponse response = new ConnectionResponse();
        
        try (Connection connection = getConnection(config)) {
            // Get column information for the table
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("DESCRIBE TABLE " + tableName);
            
            List<Column> columns = new ArrayList<>();
            while (rs.next()) {
                Column column = new Column();
                column.setName(rs.getString(1));
                column.setType(rs.getString(2));
                columns.add(column);
            }
            
            response.setColumns(columns);
            response.setSuccess(true);
            return response;
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("Failed to get table columns: " + e.getMessage());
            throw e;
        }
    }
    
    public PreviewResponse getPreviewData(ClickHouseConfig config, String tableName, 
                                          List<String> columns, int limit) throws Exception {
        PreviewResponse response = new PreviewResponse();
        
        try (Connection connection = getConnection(config)) {
            // Build query to fetch preview data
            StringBuilder queryBuilder = new StringBuilder("SELECT ");
            for (int i = 0; i < columns.size(); i++) {
                queryBuilder.append(columns.get(i));
                if (i < columns.size() - 1) {
                    queryBuilder.append(", ");
                }
            }
            queryBuilder.append(" FROM ").append(tableName).append(" LIMIT ").append(limit);
            
            // Execute query
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(queryBuilder.toString());
            ResultSetMetaData metaData = rs.getMetaData();
            int columnCount = metaData.getColumnCount();
            
            // Process results
            List<Map<String, Object>> data = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= columnCount; i++) {
                    String columnName = metaData.getColumnName(i);
                    Object value = rs.getObject(i);
                    row.put(columnName, value);
                }
                data.add(row);
            }
            
            response.setData(data);
            response.setSuccess(true);
            return response;
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("Failed to get preview data: " + e.getMessage());
            throw e;
        }
    }
    
    private Connection getConnection(ClickHouseConfig config) throws Exception {
        Properties properties = new Properties();
        properties.setProperty("user", config.getUser());
        
        // Use JWT token for authentication
        if (config.getJwtToken() != null && !config.getJwtToken().isEmpty()) {
            properties.setProperty("password", config.getJwtToken());
        }
        
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