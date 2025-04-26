package com.example.ukrdamagereport.controller;

import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.entity.Region;
import com.example.ukrdamagereport.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<List<AllPlaceDto>> getAllRegions() {
        return ResponseEntity.ok(placeService.getAllRegionsSummary());
    }

    @GetMapping("/{regionId}")
    public ResponseEntity<List<PlaceDto>> getAllPlaceByRegion(@PathVariable String regionId) {
        return ResponseEntity.ok(placeService.getPlacesByRegion(regionId));
    }
}