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
    public ResponseEntity<?> importCsvData() {
        return ResponseEntity.ok(csvImportService.importCsvData());
    }
} 