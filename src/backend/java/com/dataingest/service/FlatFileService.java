
package com.dataingest.service;

import com.dataingest.model.*;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FlatFileService {
    
    public ConnectionResponse readSchema(FlatFileConfig config) throws Exception {
        ConnectionResponse response = new ConnectionResponse();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(config.getFileName()))) {
            // Read the first line to get column names
            String headerLine = reader.readLine();
            if (headerLine != null) {
                String[] headers = headerLine.split(config.getDelimiter());
                
                List<Column> columns = new ArrayList<>();
                for (String header : headers) {
                    Column column = new Column();
                    column.setName(header.trim());
                    column.setType("String"); // Default to string type for all columns
                    columns.add(column);
                }
                
                response.setColumns(columns);
                response.setSuccess(true);
            } else {
                response.setSuccess(false);
                response.setError("Empty file");
            }
            
            return response;
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("Failed to read file schema: " + e.getMessage());
            throw e;
        }
    }
    
    public PreviewResponse getPreviewData(FlatFileConfig config, List<String> columns, int limit) throws Exception {
        PreviewResponse response = new PreviewResponse();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(config.getFileName()))) {
            // Read the first line to get all column names
            String headerLine = reader.readLine();
            if (headerLine != null) {
                String[] headers = headerLine.split(config.getDelimiter());
                Map<String, Integer> columnIndexMap = new HashMap<>();
                
                // Map column names to their index positions
                for (int i = 0; i < headers.length; i++) {
                    columnIndexMap.put(headers[i].trim(), i);
                }
                
                // Read data rows up to the limit
                List<Map<String, Object>> data = new ArrayList<>();
                String line;
                int count = 0;
                
                while ((line = reader.readLine()) != null && count < limit) {
                    String[] values = line.split(config.getDelimiter(), -1);
                    Map<String, Object> row = new HashMap<>();
                    
                    // Only include the selected columns
                    for (String column : columns) {
                        Integer index = columnIndexMap.get(column);
                        if (index != null && index < values.length) {
                            row.put(column, values[index]);
                        } else {
                            row.put(column, "");
                        }
                    }
                    
                    data.add(row);
                    count++;
                }
                
                response.setData(data);
                response.setSuccess(true);
            } else {
                response.setSuccess(false);
                response.setError("Empty file");
            }
            
            return response;
        } catch (Exception e) {
            response.setSuccess(false);
            response.setError("Failed to read preview data: " + e.getMessage());
            throw e;
        }
    }
}
