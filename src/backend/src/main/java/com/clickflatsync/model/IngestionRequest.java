package com.clickflatsync.model;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class IngestionRequest {
    @NotBlank(message = "Source is required")
    private String source;

    private ClickHouseConfig clickHouse;

    private FlatFileConfig flatFile;

    @NotEmpty(message = "Selected columns are required")
    private List<String> selectedColumns;
}