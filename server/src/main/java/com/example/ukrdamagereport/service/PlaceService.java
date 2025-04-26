package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;

import java.util.List;

public interface PlaceService {
    List<AllPlaceDto> getAllRegionsSummary();
    List<PlaceDto> getPlacesByRegion(String regionId);
    Place getPlaceById(Long id);
}
