package com.example.ukrdamagereport.controller;

import com.example.ukrdamagereport.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/csv")
@RequiredArgsConstructor
public class ImportController {

    private final CsvImportService csvImportService;

    @PostMapping("/import")
    public ResponseEntity<String> importCsvData() {
        try {
            csvImportService.importCsvData();
            return ResponseEntity.ok("CSV data imported successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to import CSV data: " + e.getMessage());
        }
    }
} 