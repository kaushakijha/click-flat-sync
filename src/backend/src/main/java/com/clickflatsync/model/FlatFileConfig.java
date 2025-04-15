package com.clickflatsync.model;

import lombok.Data;
import java.util.List;

import javax.validation.constraints.NotBlank;

@Data
public class FlatFileConfig {
    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "Delimiter is required")
    private String delimiter;

    private String tableName;
    private String inputFile;
    private String outputFile;
    private List<String> selectedColumns;
    private List<String> columns;

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public void setInputFile(String inputFile) {
        this.inputFile = inputFile;
    }

    public void setOutputFile(String outputFile) {
        this.outputFile = outputFile;
    }

    public void setSelectedColumns(List<String> selectedColumns) {
        this.selectedColumns = selectedColumns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }
}