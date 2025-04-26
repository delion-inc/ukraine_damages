package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.PageResponse;
import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;

import java.util.List;

public interface PlaceService {

    List<AllPlaceDto> getAllRegionsSummary();

    PageResponse<PlaceDto> getPlacesByRegion(String regionId, int page, int size);
}
