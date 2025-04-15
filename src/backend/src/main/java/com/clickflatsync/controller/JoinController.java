package com.clickflatsync.controller;

import com.clickflatsync.model.ClickHouseConfig;
import com.clickflatsync.model.IngestionResponse;
import com.clickflatsync.service.JoinService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/join")
@RequiredArgsConstructor
public class JoinController {

    private final JoinService joinService;

    @PostMapping("/execute")
    public ResponseEntity<IngestionResponse> executeJoin(
            @RequestBody ClickHouseConfig config,
            @RequestParam List<String> tables,
            @RequestParam List<String> joinConditions,
            @RequestParam List<String> selectedColumns,
            @RequestParam String outputFile) {

        log.info("Received join request for tables: {}", tables);

        IngestionResponse response = joinService.executeJoin(
                config,
                tables,
                joinConditions,
                selectedColumns,
                outputFile);

        if (response.getError() != null) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
}