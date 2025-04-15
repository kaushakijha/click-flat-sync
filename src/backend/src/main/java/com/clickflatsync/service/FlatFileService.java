package com.clickflatsync.service;

import com.clickflatsync.model.ColumnInfo;
import com.clickflatsync.model.FlatFileConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class FlatFileService {

    public List<ColumnInfo> getColumns(FlatFileConfig config) throws Exception {
        List<ColumnInfo> columns = new ArrayList<>();

        File file = new File(config.getFileName());
        if (!file.exists()) {
            throw new IllegalArgumentException("File not found: " + config.getFileName());
        }

        // Determine the delimiter
        char delimiter = config.getDelimiter().charAt(0);
        CSVFormat csvFormat = CSVFormat.DEFAULT.withDelimiter(delimiter).withFirstRecordAsHeader();

        try (Reader reader = new FileReader(file)) {
            Iterable<CSVRecord> records = csvFormat.parse(reader);
            CSVRecord headerRecord = records.iterator().next();

            for (String header : headerRecord.getParser().getHeaderNames()) {
                columns.add(new ColumnInfo(header, "string"));
            }
        }

        return columns;
    }

    public int getRecordCount(FlatFileConfig config) throws Exception {
        File file = new File(config.getFileName());
        if (!file.exists()) {
            throw new IllegalArgumentException("File not found: " + config.getFileName());
        }

        // Determine the delimiter
        char delimiter = config.getDelimiter().charAt(0);
        CSVFormat csvFormat = CSVFormat.DEFAULT.withDelimiter(delimiter).withFirstRecordAsHeader();

        int count = 0;
        try (Reader reader = new FileReader(file)) {
            Iterable<CSVRecord> records = csvFormat.parse(reader);
            for (CSVRecord record : records) {
                count++;
            }
        }

        return count;
    }
}