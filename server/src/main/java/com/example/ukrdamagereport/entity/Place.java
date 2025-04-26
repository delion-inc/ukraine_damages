package com.example.ukrdamagereport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Data
@Entity
@Table(name = "place")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "oblast", nullable = false)
    private Region oblast;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_of_infrastructure")
    private InfrastructureType typeOfInfrastructure;

    @Column(name = "date_of_event")
    private LocalDate dateOfEvent;

    @Column(name = "source_name")
    private String sourceName;

    @Column(name = "source_date")
    private LocalDate sourceDate;

    @Column(name = "source_link", columnDefinition = "TEXT")
    private String sourceLink;

    @Column(name = "additional_sources", columnDefinition = "TEXT")
    private String additionalSources;

    @Column(name = "extent_of_damage")
    private String extentOfDamage;

    @Column(name = "internal_filter_date")
    private LocalDate internalFilterDate;

    @Column(name = "amount")
    private Double amount;
} 