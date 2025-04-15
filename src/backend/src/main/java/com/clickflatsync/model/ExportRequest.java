package com.clickflatsync.model;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ExportRequest {
    @Valid
    @NotNull(message = "Config must not be null")
    private ClickHouseConfig config;

    @NotEmpty(message = "Columns list must not be empty")
    private List<String> columns;

    @NotNull(message = "Output file must be specified")
    private String outputFile;
}