package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.dto.PageResponse;
import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;
import com.example.ukrdamagereport.mapper.PlaceMapper;
import com.example.ukrdamagereport.repository.PlaceRepository;
import com.example.ukrdamagereport.service.PlaceService;
import com.example.ukrdamagereport.util.RegionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    @Override
    public List<AllPlaceDto> getAllRegionsSummary() {
        Map<Region, Long> damageByRegion = placeRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        Place::getOblast,
                        Collectors.summingLong(place -> 1L)
                ));

        return Arrays.stream(Region.values())
                .map(region -> PlaceMapper.mapToDto(
                        region,
                        damageByRegion.getOrDefault(region, 0L)
                ))
                .collect(Collectors.toList());
    }

    @Override
    public PageResponse<PlaceDto> getPlacesByRegion(String regionId, int page, int size) {
        Region region = RegionUtil.findById(regionId);
        Pageable pageable = PageRequest.of(page, size);
        Page<Place> placePage = placeRepository.findByOblast(region, pageable);
        return PlaceMapper.mapToPageResponse(placePage);
    }
}

