
package com.dataingest.model;

public class SourceConfig {
    private String type; // "clickhouse" or "flatfile"
    private ClickHouseConfig clickhouseConfig;
    private FlatFileConfig flatFileConfig;
    
    // Getters and Setters
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public ClickHouseConfig getClickhouseConfig() {
        return clickhouseConfig;
    }
    
    public void setClickhouseConfig(ClickHouseConfig clickhouseConfig) {
        this.clickhouseConfig = clickhouseConfig;
    }
    
    public FlatFileConfig getFlatFileConfig() {
        return flatFileConfig;
    }
    
    public void setFlatFileConfig(FlatFileConfig flatFileConfig) {
        this.flatFileConfig = flatFileConfig;
    }
}
