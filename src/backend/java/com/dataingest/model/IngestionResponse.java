
package com.dataingest.model;

public class IngestionResponse {
    private boolean success;
    private long recordCount;
    private String error;
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public long getRecordCount() {
        return recordCount;
    }
    
    public void setRecordCount(long recordCount) {
        this.recordCount = recordCount;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}
