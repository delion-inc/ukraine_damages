package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.dto.report.PythonDamageReportDto;
import com.example.ukrdamagereport.entity.DamageReport;
import com.example.ukrdamagereport.mapper.DamageReportMapper;
import com.example.ukrdamagereport.repository.DamageReportRepository;
import com.example.ukrdamagereport.service.DamageReportService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class DamageReportServiceImpl implements DamageReportService {

    private final DamageReportRepository damageReportRepository;
    private final DamageReportMapper damageReportMapper;
    private final RestTemplate restTemplate;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public DamageReportResponseDto createPlace(@Valid DamageReportCreateDto reportDto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String photoBeforeBase64 = null;
            String photoAfterBase64 = null;

            if (reportDto.getPhotoBefore() != null) {
                String filename = Paths.get(reportDto.getPhotoBefore()).getFileName().toString();
                Path beforePath = Paths.get(uploadDir, filename);
                System.out.println("Reading before image from: " + beforePath.toAbsolutePath());
                photoBeforeBase64 = Base64.getEncoder().encodeToString(Files.readAllBytes(beforePath));
            }

            if (reportDto.getPhotoAfter() != null) {
                String filename = Paths.get(reportDto.getPhotoAfter()).getFileName().toString();
                Path afterPath = Paths.get(uploadDir, filename);
                System.out.println("Reading after image from: " + afterPath.toAbsolutePath());
                photoAfterBase64 = Base64.getEncoder().encodeToString(Files.readAllBytes(afterPath));
            }

            PythonDamageReportDto pythonDto = PythonDamageReportDto.builder()
                    .description(reportDto.getDescription())
                    .photoBeforeBase64(photoBeforeBase64)
                    .photoAfterBase64(photoAfterBase64)
                    .infrastructureType(reportDto.getInfrastructureType().name())
                    .areaSizeSqM(reportDto.getAreaSizeSqM())
                    .floors(reportDto.getFloors())
                    .constructionYear(reportDto.getConstructionYear())
                    .address(reportDto.getAddress())
                    .additionalInfo(reportDto.getAdditionalInfo())
                    .build();

            HttpEntity<PythonDamageReportDto> request = new HttpEntity<>(pythonDto, headers);

            DamageReport damageReport = restTemplate.postForObject(
                    "http://localhost:8000/python",
                    request,
                    DamageReport.class
            );

            if (damageReport == null) {
                System.err.println("Received null response from Python service");
                damageReport = damageReportMapper.toEntity(reportDto);
            }

            damageReport = damageReportRepository.save(damageReport);
            return damageReportMapper.toDto(damageReport);

        } catch (IOException e) {
            System.err.println("Error reading image files: " + e.getMessage());
            throw new RuntimeException("Failed to process image files", e);
        } catch (Exception e) {
            System.err.println("Error processing request: " + e.getMessage());
            throw new RuntimeException("Failed to process damage report", e);
        }
    }
}
