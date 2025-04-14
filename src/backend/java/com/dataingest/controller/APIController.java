
package com.dataingest.controller;

import com.dataingest.model.ConnectionRequest;
import com.dataingest.model.ConnectionResponse;
import com.dataingest.model.PreviewRequest;
import com.dataingest.model.PreviewResponse;
import com.dataingest.model.IngestionRequest;
import com.dataingest.model.IngestionResponse;
import com.dataingest.service.ClickHouseService;
import com.dataingest.service.FlatFileService;
import com.dataingest.service.DataTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class APIController {
    
    @Autowired
    private ClickHouseService clickHouseService;
    
    @Autowired
    private FlatFileService flatFileService;
    
    @Autowired
    private DataTransferService dataTransferService;
    
    @PostMapping("/connect")
    public ConnectionResponse connect(@RequestBody ConnectionRequest request) {
        try {
            if ("clickhouse".equals(request.getSource().getType())) {
                return clickHouseService.connect(request.getSource().getClickhouseConfig());
            } else {
                return flatFileService.readSchema(request.getSource().getFlatFileConfig());
            }
        } catch (Exception e) {
            ConnectionResponse response = new ConnectionResponse();
            response.setSuccess(false);
            response.setError("Connection failed: " + e.getMessage());
            return response;
        }
    }
    
    @PostMapping("/columns")
    public ConnectionResponse getColumns(@RequestBody ConnectionRequest request) {
        try {
            return clickHouseService.getTableColumns(
                request.getSource().getClickhouseConfig(), 
                request.getTableName()
            );
        } catch (Exception e) {
            ConnectionResponse response = new ConnectionResponse();
            response.setSuccess(false);
            response.setError("Failed to get columns: " + e.getMessage());
            return response;
        }
    }
    
    @PostMapping("/preview")
    public PreviewResponse getPreview(@RequestBody PreviewRequest request) {
        try {
            if ("clickhouse".equals(request.getSource().getType())) {
                return clickHouseService.getPreviewData(
                    request.getSource().getClickhouseConfig(),
                    request.getTable(),
                    request.getColumns(),
                    request.getLimit()
                );
            } else {
                return flatFileService.getPreviewData(
                    request.getSource().getFlatFileConfig(),
                    request.getColumns(),
                    request.getLimit()
                );
            }
        } catch (Exception e) {
            PreviewResponse response = new PreviewResponse();
            response.setSuccess(false);
            response.setError("Preview failed: " + e.getMessage());
            return response;
        }
    }
    
    @PostMapping("/ingest")
    public IngestionResponse startIngestion(@RequestBody IngestionRequest request) {
        try {
            if ("clickhouse".equals(request.getSource().getType()) && 
                "flatfile".equals(request.getTarget().getType())) {
                // ClickHouse to Flat File
                return dataTransferService.transferClickHouseToFlatFile(
                    request.getSource().getClickhouseConfig(),
                    request.getTarget().getFlatFileConfig(),
                    request.getTable(),
                    request.getColumns()
                );
            } else if ("flatfile".equals(request.getSource().getType()) && 
                       "clickhouse".equals(request.getTarget().getType())) {
                // Flat File to ClickHouse
                return dataTransferService.transferFlatFileToClickHouse(
                    request.getSource().getFlatFileConfig(),
                    request.getTarget().getClickhouseConfig(),
                    request.getTableName(),
                    request.getColumns()
                );
            } else {
                IngestionResponse response = new IngestionResponse();
                response.setSuccess(false);
                response.setError("Unsupported source/target combination");
                return response;
            }
        } catch (Exception e) {
            IngestionResponse response = new IngestionResponse();
            response.setSuccess(false);
            response.setError("Ingestion failed: " + e.getMessage());
            return response;
        }
    }
}
