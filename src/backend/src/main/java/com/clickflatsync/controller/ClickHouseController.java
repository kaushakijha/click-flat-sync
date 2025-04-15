package com.clickflatsync.controller;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.ColumnInfo;
import com.clickflatsync.model.IngestionResponse;
import com.clickflatsync.model.ExportRequest;
import com.clickflatsync.model.ImportRequest;
import com.clickflatsync.service.ClickHouseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClickHouseController {

    private final ClickHouseService clickHouseService;

    @PostMapping("/connect")
    public ResponseEntity<Boolean> testConnection(@Valid @RequestBody ClickHouseConfig config) {
        try {
            log.info("Testing connection to ClickHouse at {}:{}", config.getHost(), config.getPort());
            boolean isConnected = clickHouseService.testConnection(config);
            return ResponseEntity.ok(isConnected);
        } catch (Exception e) {
            log.error("Connection test failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(false);
        }
    }

    @PostMapping("/columns")
    public ResponseEntity<List<ColumnInfo>> getColumns(@Valid @RequestBody ClickHouseConfig config) {
        try {
            log.info("Fetching columns for database: {}", config.getDatabase());
            List<ColumnInfo> columns = clickHouseService.getColumns(config);
            return ResponseEntity.ok(columns);
        } catch (Exception e) {
            log.error("Error getting columns: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/export")
    public ResponseEntity<IngestionResponse> exportToFile(@Valid @RequestBody ExportRequest request) {
        try {
            log.info("Exporting data to file: {}", request.getOutputFile());
            var response = clickHouseService.exportToFlatFile(
                    request.getConfig(),
                    request.getColumns(),
                    request.getOutputFile());
            if (response.getError() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Export failed with exception: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(IngestionResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/import")
    public ResponseEntity<IngestionResponse> importFromFile(@Valid @RequestBody ImportRequest request) {
        try {
            log.info("Importing data from file: {}", request.getInputFile());
            var response = clickHouseService.importFromFlatFile(
                    request.getConfig(),
                    request.getInputFile(),
                    request.getColumns());
            if (response.getError() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Import failed with exception: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(IngestionResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<?> getPreviewData(
            @Valid @RequestBody ClickHouseConfig config,
            @RequestParam List<String> columns) {
        try {
            log.info("Getting preview data for table: {}", config.getTableName());
            List<Map<String, Object>> previewData = clickHouseService.getPreviewData(config, columns, 100);
            return ResponseEntity.ok(previewData);
        } catch (Exception e) {
            log.error("Error getting preview data: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}