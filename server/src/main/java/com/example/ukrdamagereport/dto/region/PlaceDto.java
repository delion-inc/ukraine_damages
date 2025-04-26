package com.example.ukrdamagereport.dto.region;

import com.example.ukrdamagereport.entity.InfrastructureType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDto {
    private Long id;
    private String oblast;
    private String oblastName;
    private InfrastructureType typeOfInfrastructure;
    private LocalDate dateOfEvent;
    private String sourceName;
    private LocalDate sourceDate;
    private String sourceLink;
    private String additionalSources;
    private String extentOfDamage;
    private LocalDate internalFilterDate;
    private Double amount;
}