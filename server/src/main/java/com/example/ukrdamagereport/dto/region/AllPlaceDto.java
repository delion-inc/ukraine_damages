package com.example.ukrdamagereport.dto.region;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AllPlaceDto {
    private String regionId;
    private String regionName;
    private Long totalDamage;
}
