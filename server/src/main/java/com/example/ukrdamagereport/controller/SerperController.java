package com.example.ukrdamagereport.controller;

import com.example.ukrdamagereport.dto.serper.res.SerperResponse;
import com.example.ukrdamagereport.service.SerperApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SerperController {
//TODO: PLEASE DELETE ME I`M TEST CONTROLLER
    private final SerperApiService serperApiService;

    @GetMapping
    public ResponseEntity<SerperResponse> search(@RequestParam String query) {
        try {
            SerperResponse response = serperApiService.search(query);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}