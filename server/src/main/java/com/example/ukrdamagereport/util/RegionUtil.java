package com.example.ukrdamagereport.util;

import com.example.ukrdamagereport.entity.Region;
import com.example.ukrdamagereport.exception.RegionNotFoundException;
import java.util.Arrays;

public class RegionUtil {
    
    public static Region findById(String regionId) {
        return Arrays.stream(Region.values())
                .filter(region -> region.getId().equals(regionId))
                .findFirst()
                .orElseThrow(() -> new RegionNotFoundException("Region not found with id: " + regionId));
    }
} 