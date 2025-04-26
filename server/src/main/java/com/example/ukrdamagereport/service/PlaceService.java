package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;

import java.util.List;

public interface PlaceService {
    List<AllPlaceDto> getAllRegionsSummary();
    List<PlaceDto> getPlacesByRegion(String regionId);
}
