package com.example.ukrdamagereport.mapper;

import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;

public class PlaceMapper {
    
    public static AllPlaceDto mapToDto(Region region, Long totalDamage) {
        return new AllPlaceDto(
            region.name().toLowerCase(),
            region.getName(),
            totalDamage
        );
    }

    public static PlaceDto mapToPlaceDto(Place place) {
        return new PlaceDto(
            place.getId(),
            place.getOblast().name().toLowerCase(),
            place.getOblast().getName(),
            place.getTypeOfInfrastructure(),
            place.getDateOfEvent(),
            place.getSourceName(),
            place.getSourceDate(),
            place.getSourceLink(),
            place.getAdditionalSources(),
            place.getExtentOfDamage(),
            place.getInternalFilterDate(),
            place.getAmount()
        );
    }
}
