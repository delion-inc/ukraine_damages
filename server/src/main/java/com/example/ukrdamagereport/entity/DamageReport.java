package com.example.ukrdamagereport.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "damage_report")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DamageReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(name = "photo_before")
    private String photoBefore;

    @Column(name = "photo_after")
    private String photoAfter;

    @Enumerated(EnumType.STRING)
    @Column(name = "infrastructure_type", nullable = false)
    private InfrastructureType infrastructureType;

    @Column(name = "area_size_sq_m")
    private Double areaSizeSqM;

    @Column(name = "floors")
    private Integer floors;

    @Column(name = "construction_year")
    private Integer constructionYear;

    private String address;

    @Column(name = "additional_info")
    private String additionalInfo;
}
