
package com.dataingest.model;

public class ConnectionRequest {
    private SourceConfig source;
    private String tableName;
    
    // Getters and Setters
    public SourceConfig getSource() {
        return source;
    }
    
    public void setSource(SourceConfig source) {
        this.source = source;
    }
    
    public String getTableName() {
        return tableName;
    }
    
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
