
package com.dataingest.model;

import java.util.List;

public class IngestionRequest {
    private SourceConfig source;
    private TargetConfig target;
    private String table;
    private String tableName; // For target table name
    private List<String> columns;
    
    // Getters and Setters
    public SourceConfig getSource() {
        return source;
    }
    
    public void setSource(SourceConfig source) {
        this.source = source;
    }
    
    public TargetConfig getTarget() {
        return target;
    }
    
    public void setTarget(TargetConfig target) {
        this.target = target;
    }
    
    public String getTable() {
        return table;
    }
    
    public void setTable(String table) {
        this.table = table;
    }
    
    public String getTableName() {
        return tableName;
    }
    
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
    
    public List<String> getColumns() {
        return columns;
    }
    
    public void setColumns(List<String> columns) {
        this.columns = columns;
    }
}
