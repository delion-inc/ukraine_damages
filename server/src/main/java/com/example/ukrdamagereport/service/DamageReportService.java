package com.example.ukrdamagereport.service;

import com.example.ukrdamagereport.dto.region.PlaceDto;
import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import jakarta.validation.Valid;

import java.util.List;

public interface DamageReportService {

    DamageReportResponseDto createPlace(@Valid DamageReportCreateDto placeDto);

    void deleteAllImages();

    List<DamageReportResponseDto> getAllDamageReports();
}
