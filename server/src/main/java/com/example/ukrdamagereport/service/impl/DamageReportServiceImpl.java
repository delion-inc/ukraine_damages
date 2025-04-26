package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.dto.report.PythonServiceResponse;
import com.example.ukrdamagereport.entity.DamageReport;
import com.example.ukrdamagereport.mapper.DamageReportMapper;
import com.example.ukrdamagereport.repository.DamageReportRepository;
import com.example.ukrdamagereport.service.DamageReportService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class DamageReportServiceImpl implements DamageReportService {

    private static final String PYTHON_URL = "http://93.127.131.80:8000/response";

    private final DamageReportRepository damageReportRepository;
    private final DamageReportMapper damageReportMapper;
    private final RestTemplate restTemplate;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    @Transactional
    public DamageReportResponseDto createPlace(@Valid DamageReportCreateDto reportDto) {
        try {
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

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            log.info("Sending request to Python service with fields: {}", body.keySet());
            
            DamageReport damageReport = damageReportMapper.toEntity(reportDto);
            
            try {
                ResponseEntity<PythonServiceResponse> response = restTemplate.postForEntity(
                        PYTHON_URL,
                        requestEntity,
                        PythonServiceResponse.class
                );
                
                log.info("Raw Python service response: {}", response.getBody());
                
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    PythonServiceResponse pythonResponse = response.getBody();
                    
                    log.info("Python service evaluation: Money = {}, Description = {}", 
                            pythonResponse.getMoney_evaluation(),
                            pythonResponse.getDescription());
                    
                    if (pythonResponse.getMoney_evaluation() != null) {
                        damageReport.setAmount(pythonResponse.getMoney_evaluation());
                    }
                    
                    if (pythonResponse.getDescription() != null) {
                        damageReport.setAdditionDescription(pythonResponse.getDescription());
                    }
                }
            } catch (Exception e) {
                log.error("Error from Python service: {}", e.getMessage());
                log.error("Full error: ", e);
            }

            damageReport = damageReportRepository.save(damageReport);
            return damageReportMapper.toDto(damageReport);

        } catch (IOException e) {
            log.error("Error reading image files: {}", e.getMessage());
            throw new RuntimeException("Failed to process image files", e);
        } catch (Exception e) {
            log.error("Error processing request: {}", e.getMessage());
            throw new RuntimeException("Failed to process damage report", e);
        }
    }

    @Override
    public void deleteAllImages() {
        try {
            Path directory = Paths.get("src/main/resources/static/images");
            if (Files.exists(directory)) {
                Files.list(directory)
                    .filter(path -> !Files.isDirectory(path))
                    .forEach(file -> {
                        try {
                            Files.delete(file);
                            log.info("Deleted file: {}", file.getFileName());
                        } catch (IOException e) {
                            log.error("Error deleting file {}: {}", file.getFileName(), e.getMessage());
                        }
                    });
                log.info("All files in {} have been deleted", directory);
            } else {
                log.warn("Directory {} does not exist", directory);
            }
        } catch (IOException e) {
            log.error("Error while deleting files: {}", e.getMessage());
            throw new RuntimeException("Failed to delete files", e);
        }
    }
}
