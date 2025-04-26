package com.example.ukrdamagereport.mapper;

import com.example.ukrdamagereport.dto.PageResponse;
import com.example.ukrdamagereport.dto.region.AllPlaceDto;
import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
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

    public static PageResponse<PlaceDto> mapToPageResponse(Page<Place> placePage) {
        List<PlaceDto> content = placePage.getContent().stream()
                .map(PlaceMapper::mapToPlaceDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                (int) placePage.getTotalElements(),
                placePage.getTotalPages(),
                placePage.getNumber()
        );
    }
}
