package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import jakarta.validation.Valid;

public interface DamageReportService {

    DamageReportResponseDto createPlace(@Valid DamageReportCreateDto placeDto);

    void deleteAllImages();
}
