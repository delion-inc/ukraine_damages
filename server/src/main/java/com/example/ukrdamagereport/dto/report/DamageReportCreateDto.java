package com.example.ukrdamagereport.dto.report;

import com.example.ukrdamagereport.entity.InfrastructureType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class DamageReportCreateDto {
    
    private byte[] photoBefore;
    
    private byte[] photoAfter;

    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Infrastructure Type is required")
    private InfrastructureType infrastructureType;
    
    @PositiveOrZero(message = "Area size must be positive or zero")
    private Double areaSizeSqM;
    
    @PositiveOrZero(message = "Number of floors must be positive or zero")
    private Integer floors;
    
    @PositiveOrZero(message = "Construction year must be positive")
    private Integer constructionYear;
    
    private String address;
    
    private String additionalInfo;
}
