package com.example.ukrdamagereport.dto.report;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PythonDamageReportDto {
    private String description;
    private String photoBeforeBase64;
    private String photoAfterBase64;
    private String infrastructureType;
    private Double areaSizeSqM;
    private Integer floors;
    private Integer constructionYear;
    private String address;
    private String additionalInfo;
} 