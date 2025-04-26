package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.entity.Place;
import com.example.ukrdamagereport.entity.Region;
import com.example.ukrdamagereport.entity.InfrastructureType;
import com.example.ukrdamagereport.repository.PlaceRepository;
import com.example.ukrdamagereport.service.CsvImportService;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CsvImportServiceImpl implements CsvImportService {

    private final PlaceRepository placeRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("M/d/yyyy");

    @Transactional
    public void importCsvData() {
        String csvFile = "records.csv";
        List<Place> places = new ArrayList<>();
        int totalLines = 0;

        try (CSVReader reader = new CSVReader(new InputStreamReader(new ClassPathResource(csvFile).getInputStream()))) {
            reader.readNext();

            String[] line;
            while ((line = reader.readNext()) != null) {
                totalLines++;
                try {
                    Place place = mapCsvLineToPlace(line);
                    if (place != null) {
                        places.add(place);
                    }
                } catch (Exception e) {
                    log.error("Failed to parse line {}: {}", totalLines, String.join(",", line));
                }
                if (places.size() >= 100) {
                    placeRepository.saveAll(places);
                    places.clear();
                }
            }

            if (!places.isEmpty()) {
                placeRepository.saveAll(places);
            }

            log.info("Import completed. Total lines processed: {}", totalLines);

        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Failed to import CSV data", e);
        }
    }

    private Place mapCsvLineToPlace(String[] line) {
        try {
            return Place.builder()
                    .oblast(Region.fromString(line[1].trim()))
                    .typeOfInfrastructure(InfrastructureType.fromString(line[2].trim()))
                    .dateOfEvent(parseDate(line[3].trim()))
                    .sourceName(line[4].trim())
                    .sourceDate(parseDate(line[5].trim()))
                    .sourceLink(line[6].trim())
                    .additionalSources(line[7].trim())
                    .extentOfDamage(line[8].trim())
                    .internalFilterDate(parseDate(line[9].trim()))
                    .build();
        } catch (Exception e) {
            log.error("Error mapping line: {}", e.getMessage());
            return null;
        }
    }

    private LocalDate parseDate(String date) {
        try {
            return date != null && !date.trim().isEmpty() 
                ? LocalDate.parse(date.trim(), DATE_FORMATTER) 
                : null;
        } catch (Exception e) {
            return null;
        }
    }
} 