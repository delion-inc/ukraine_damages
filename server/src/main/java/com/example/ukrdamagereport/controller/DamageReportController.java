package com.example.ukrdamagereport.controller;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.entity.InfrastructureType;
import com.example.ukrdamagereport.service.DamageReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/damage-reports")
@RequiredArgsConstructor
public class DamageReportController {

    private final DamageReportService damageReportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public DamageReportResponseDto createDamageReport(
            @RequestParam(value = "photoBefore", required = false) MultipartFile photoBefore,
            @RequestParam(value = "photoAfter", required = false) MultipartFile photoAfter,
            @RequestParam("infrastructureType") String infrastructureType,
            @RequestParam("description") String description,
            @RequestParam(value = "areaSizeSqM", required = false) Double areaSizeSqM,
            @RequestParam(value = "floors", required = false) Integer floors,
            @RequestParam(value = "constructionYear", required = false) Integer constructionYear,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "additionalInfo", required = false) String additionalInfo
    ) {
        DamageReportCreateDto reportDto = new DamageReportCreateDto();
        reportDto.setDescription(description);
        reportDto.setPhotoBefore(photoBefore != null ? photoBefore.getOriginalFilename() : null);
        reportDto.setPhotoAfter(photoAfter != null ? photoAfter.getOriginalFilename() : null);
        reportDto.setInfrastructureType(InfrastructureType.valueOf(infrastructureType));
        reportDto.setAreaSizeSqM(areaSizeSqM);
        reportDto.setFloors(floors);
        reportDto.setConstructionYear(constructionYear);
        reportDto.setAddress(address);
        reportDto.setAdditionalInfo(additionalInfo);
        
        return damageReportService.createPlace(reportDto);
    }
}
