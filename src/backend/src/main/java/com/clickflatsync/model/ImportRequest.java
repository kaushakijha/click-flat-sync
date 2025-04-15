package com.clickflatsync.model;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ImportRequest {
    @Valid
    @NotNull(message = "Config must not be null")
    private ClickHouseConfig config;

    @NotNull(message = "Input file must be specified")
    private String inputFile;

    @NotEmpty(message = "Columns list must not be empty")
    private List<ColumnInfo> columns;
}