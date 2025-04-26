package com.example.ukrdamagereport.controller;

import com.example.ukrdamagereport.dto.serper.res.SerperResponse;
import com.example.ukrdamagereport.service.SerperApiService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SerperController {

    private final SerperApiService serperApiService;

    @GetMapping
    public ResponseEntity<?> search(@RequestParam String query) {
        try {
            log.debug("Received search request with query: {}", query);
            SerperResponse response = serperApiService.search(query);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("Bad request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse("Invalid request: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error during search: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Internal server error: " + e.getMessage()));
        }
    }

    @Data
    @AllArgsConstructor
    private static class ErrorResponse {
        private String message;
    }
}