package com.example.ukrdamagereport.mapper;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.entity.DamageReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DamageReportMapper {
    
    public DamageReport toEntity(DamageReportCreateDto dto) {
        if (dto == null) {
            return null;
        }
        
        return DamageReport.builder()
                .description(dto.getDescription())
                .photoBefore(dto.getPhotoBefore())
                .photoAfter(dto.getPhotoAfter())
                .infrastructureType(dto.getInfrastructureType())
                .areaSizeSqM(dto.getAreaSizeSqM())
                .floors(dto.getFloors())
                .constructionYear(dto.getConstructionYear())
                .address(dto.getAddress())
                .additionalInfo(dto.getAdditionalInfo())
                .build();
    }
    
    public DamageReportResponseDto toDto(DamageReport entity) {
        if (entity == null) {
            return null;
        }
        
        DamageReportResponseDto dto = new DamageReportResponseDto();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setPhotoBefore(entity.getPhotoBefore());
        dto.setPhotoAfter(entity.getPhotoAfter());
        dto.setInfrastructureType(entity.getInfrastructureType());
        dto.setAreaSizeSqM(entity.getAreaSizeSqM());
        dto.setFloors(entity.getFloors());
        dto.setConstructionYear(entity.getConstructionYear());
        dto.setAddress(entity.getAddress());
        dto.setAdditionalInfo(entity.getAdditionalInfo());
        
        return dto;
    }
    
    public void updateEntity(DamageReportCreateDto dto, DamageReport entity) {
        if (dto == null || entity == null) {
            return;
        }
        
        if (dto.getDescription() != null) {
            entity.setDescription(dto.getDescription());
        }
        if (dto.getPhotoBefore() != null) {
            entity.setPhotoBefore(dto.getPhotoBefore());
        }
        if (dto.getPhotoAfter() != null) {
            entity.setPhotoAfter(dto.getPhotoAfter());
        }
        if (dto.getInfrastructureType() != null) {
            entity.setInfrastructureType(dto.getInfrastructureType());
        }
        if (dto.getAreaSizeSqM() != null) {
            entity.setAreaSizeSqM(dto.getAreaSizeSqM());
        }
        if (dto.getFloors() != null) {
            entity.setFloors(dto.getFloors());
        }
        if (dto.getConstructionYear() != null) {
            entity.setConstructionYear(dto.getConstructionYear());
        }
        if (dto.getAddress() != null) {
            entity.setAddress(dto.getAddress());
        }
        if (dto.getAdditionalInfo() != null) {
            entity.setAdditionalInfo(dto.getAdditionalInfo());
        }
    }
}
