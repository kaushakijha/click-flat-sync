package com.clickflatsync.controller;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.ColumnInfo;
import com.clickflatsync.model.IngestionResponse;
import com.clickflatsync.service.ClickHouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/ingestion")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DataIngestionController {

    private final ClickHouseService clickHouseService;

    @PostMapping("/tables")
    public ResponseEntity<List<String>> getTables(@Valid @RequestBody ClickHouseConfig config) {
        try {
            List<String> tables = clickHouseService.getTables(config);
            return ResponseEntity.ok(tables);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}