package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.config.SerperConfig;
import com.example.ukrdamagereport.dto.serper.res.SerperResponse;
import com.example.ukrdamagereport.exception.SearchException;
import com.example.ukrdamagereport.service.SerperApiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class SerperApiServiceImpl implements SerperApiService {

    private final SerperConfig serperConfig;
    private final ObjectMapper objectMapper;
    private static final String IMAGES_ENDPOINT = "https://google.serper.dev/images";

    @Override
    public SerperResponse search(String query) {
        log.info("Starting image search query: {}", query);
        validateQuery(query);

        try {
            String enhancedQuery = enhanceQueryWithDestruction(query);
            log.debug("Making request with query: {}", enhancedQuery);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("q", enhancedQuery);
            requestBody.put("gl", serperConfig.getGl());
            requestBody.put("hl", serperConfig.getHl());

            HttpResponse<String> response = Unirest.post(IMAGES_ENDPOINT)
                    .header("X-API-KEY", serperConfig.getApiKey())
                    .header("Content-Type", "application/json")
                    .body(objectMapper.writeValueAsString(requestBody))
                    .asString();

            log.debug("Received response with status: {}", response.getStatus());

            if (response.getStatus() != 200) {
                log.error("API error response: {}", response.getBody());
                throw new SearchException("API request failed with status: " + response.getStatus());
            }

            SerperResponse result = objectMapper.readValue(response.getBody(), SerperResponse.class);
            logSearchResults(result, query);

            return result;

        } catch (Exception e) {
            log.error("Error during search process: {}", e.getMessage(), e);
            throw new SearchException("Failed to process search request", e);
        }
    }

    private void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }
    }

    private String enhanceQueryWithDestruction(String originalQuery) {
        String trimmedQuery = originalQuery.trim();
        if (trimmedQuery.toLowerCase().contains("destruction")) {
            return trimmedQuery;
        }
        return String.format("%s destruction after attack", trimmedQuery);
    }

    private void logSearchResults(SerperResponse result, String query) {
        if (result.getImages() != null && !result.getImages().isEmpty()) {
            log.info("Found {} images for query: {}", result.getImages().size(), query);
        } else {
            log.warn("No images found for query: {}", query);
        }
    }
}