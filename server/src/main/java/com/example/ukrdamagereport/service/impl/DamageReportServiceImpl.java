package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.dto.report.DamageReportCreateDto;
import com.example.ukrdamagereport.dto.report.DamageReportResponseDto;
import com.example.ukrdamagereport.entity.DamageReport;
import com.example.ukrdamagereport.mapper.DamageReportMapper;
import com.example.ukrdamagereport.repository.DamageReportRepository;
import com.example.ukrdamagereport.service.DamageReportService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DamageReportServiceImpl implements DamageReportService {

    private final DamageReportRepository damageReportRepository;
    private final DamageReportMapper damageReportMapper;

    @Override
    @Transactional
    public DamageReportResponseDto createPlace(@Valid DamageReportCreateDto reportDto) {
        if(reportDto.getPhotoBefore() == null) {
            System.out.println("Photo null before");
        }

        DamageReport damageReport = damageReportMapper.toEntity(reportDto);
        damageReportRepository.save(damageReport);
        return damageReportMapper.toDto(damageReport);
    }
}
