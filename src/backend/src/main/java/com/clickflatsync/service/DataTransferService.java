package com.clickflatsync.service;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.FlatFileConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataTransferService {

    private final ClickHouseService clickHouseService;

    public boolean exportToCSV(ClickHouseConfig config, FlatFileConfig fileConfig) {
        try {
            log.info("Exporting data from table {} to CSV file {}",
                    fileConfig.getTableName(), fileConfig.getOutputFile());
            return clickHouseService.exportToCSV(config, fileConfig);
        } catch (Exception e) {
            log.error("Failed to export data to CSV: {}", e.getMessage());
            return false;
        }
    }

    public boolean importFromCSV(ClickHouseConfig config, FlatFileConfig fileConfig) {
        try {
            log.info("Importing data from CSV file {} to table {}",
                    fileConfig.getInputFile(), fileConfig.getTableName());
            return clickHouseService.importFromCSV(config, fileConfig);
        } catch (Exception e) {
            log.error("Failed to import data from CSV: {}", e.getMessage());
            return false;
        }
    }
}