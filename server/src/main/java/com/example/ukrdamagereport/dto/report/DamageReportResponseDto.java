package com.example.ukrdamagereport.dto.report;

import com.example.ukrdamagereport.entity.InfrastructureType;
import lombok.Data;

@Data
public class DamageReportResponseDto {
    private Long id;
    private String description;
    private byte[] photoBefore;
    private byte[] photoAfter;
    private InfrastructureType infrastructureType;
    private Double areaSizeSqM;
    private Integer floors;
    private Integer constructionYear;
    private String address;
    private String additionalInfo;
}
