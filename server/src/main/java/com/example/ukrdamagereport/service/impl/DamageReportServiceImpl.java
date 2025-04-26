package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.dto.python.PythonServiceResponse;
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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
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

    private final DamageReportRepository damageReportRepository;
    private final DamageReportMapper damageReportMapper;
    private final RestTemplate restTemplate;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Value("${app.python-url}")
    private String pythonUrl;

    @Override
    @Transactional
    public DamageReportResponseDto createPlace(@Valid DamageReportCreateDto reportDto) {
        MultiValueMap<String, Object> body;
        try {
            body = damageReportMapper.createDamageReportRequestToAi(reportDto);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        log.info("Sending request to Python service with fields: {}", body.keySet());

        DamageReport damageReport = damageReportMapper.toEntity(reportDto);

        ResponseEntity<PythonServiceResponse> response = restTemplate.postForEntity(
                pythonUrl,
                requestEntity,
                PythonServiceResponse.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            PythonServiceResponse pythonResponse = response.getBody();

            if (pythonResponse.getMoney_evaluation() != null) {
                damageReport.setAmount(pythonResponse.getMoney_evaluation());
            }

            if (pythonResponse.getDescription() != null) {
                damageReport.setAdditionDescription(pythonResponse.getDescription());
            }
        }

        damageReport = damageReportRepository.save(damageReport);
        return damageReportMapper.toDto(damageReport);

    }

    @Override
    public void deleteAllImages() {
        try {
            Path directory = Paths.get(uploadDir);
            if (Files.exists(directory)) {
                Files.list(directory)
                        .filter(path -> !Files.isDirectory(path))
                        .forEach(file -> {
                            try {
                                Files.delete(file);
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
