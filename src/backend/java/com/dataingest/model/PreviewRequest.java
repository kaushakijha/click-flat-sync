
package com.dataingest.model;

import java.util.List;

public class PreviewRequest {
    private SourceConfig source;
    private String table;
    private List<String> columns;
    private int limit;
    
    // Getters and Setters
    public SourceConfig getSource() {
        return source;
    }
    
    public void setSource(SourceConfig source) {
        this.source = source;
    }
    
    public String getTable() {
        return table;
    }
    
    public void setTable(String table) {
        this.table = table;
    }
    
    public List<String> getColumns() {
        return columns;
    }
    
    public void setColumns(List<String> columns) {
        this.columns = columns;
    }
    
    public int getLimit() {
        return limit;
    }
    
    public void setLimit(int limit) {
        this.limit = limit;
    }
}
