package com.clickflatsync.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngestionResponse {
    private String message;
    private String error;
    private int recordCount;
    private boolean success;

    public static IngestionResponse success(String message, int recordCount) {
        return new IngestionResponse(message, null, recordCount, true);
    }

    public static IngestionResponse error(String error) {
        return new IngestionResponse(null, error, 0, false);
    }
}