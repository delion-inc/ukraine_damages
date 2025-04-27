package com.example.ukrdamagereport.mapper;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.entity.DamageReport;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Component
@RequiredArgsConstructor
public class DamageReportMapper {

    @Value("${app.upload-dir}")
    private String uploadDir;

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
        dto.setAmount(entity.getAmount());
        dto.setAdditionDescription(entity.getAdditionDescription());
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
    }

    public MultiValueMap<String, Object> createDamageReportRequestToAi(@Valid DamageReportCreateDto reportDto) throws IOException {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        body.add("object_type", reportDto.getInfrastructureType().name());

        if (reportDto.getDescription() != null) {
            body.add("description", reportDto.getDescription());
        }
        if (reportDto.getAreaSizeSqM() != null) {
            body.add("area_size_sqm", reportDto.getAreaSizeSqM());
        }
        if (reportDto.getFloors() != null) {
            body.add("floors", reportDto.getFloors());
        }
        if (reportDto.getConstructionYear() != null) {
            body.add("construction_year", reportDto.getConstructionYear());
        }
        if (reportDto.getAddress() != null) {
            body.add("address", reportDto.getAddress());
        }

        if (reportDto.getPhotoBefore() != null) {
            String filename = Paths.get(reportDto.getPhotoBefore()).getFileName().toString();
            Path beforePath = Paths.get(uploadDir, filename);
            byte[] beforeBytes = Files.readAllBytes(beforePath);
            ByteArrayResource beforeResource = new ByteArrayResource(beforeBytes) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };
            body.add("photo_before", beforeResource);
        }

        if (reportDto.getPhotoAfter() != null) {
            String filename = Paths.get(reportDto.getPhotoAfter()).getFileName().toString();
            Path afterPath = Paths.get(uploadDir, filename);
            byte[] afterBytes = Files.readAllBytes(afterPath);
            ByteArrayResource afterResource = new ByteArrayResource(afterBytes) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };
            body.add("photo_after", afterResource);
        }

        return body;
    }
}
