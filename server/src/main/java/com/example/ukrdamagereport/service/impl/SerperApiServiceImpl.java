package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.config.SerperConfig;
import com.example.ukrdamagereport.dto.serper.res.SerperResponse;
import com.example.ukrdamagereport.service.SerperApiService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import kong.unirest.UnirestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class SerperApiServiceImpl implements SerperApiService {

    private final SerperConfig serperConfig;
    private final ObjectMapper objectMapper;

    @Override
    public SerperResponse search(String query) {
        log.info("Starting image search query: {}", query);
        validateQuery(query);

        try {
            String enhancedQuery = enhanceQueryWithDestruction(query);
            log.debug("Making request with query: {}", enhancedQuery);

            HttpResponse<String> response = Unirest.get(serperConfig.getApiUrl())
                    .header("X-API-KEY", serperConfig.getApiKey())
                    .queryString("q", enhancedQuery)
                    .queryString("location", serperConfig.getLocation())
                    .queryString("gl", serperConfig.getGl())
                    .queryString("hl", serperConfig.getHl())
                    .asString();

            if (response.getStatus() != 200) {
                log.error("API error response: {}", response.getBody());
                throw new RuntimeException("API request failed with status: " + response.getStatus());
            }

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode imagesNode = rootNode.get("images");

            SerperResponse result = new SerperResponse();

            if (imagesNode != null && imagesNode.isArray() && imagesNode.size() > 0) {
                JsonNode firstImage = imagesNode.get(0);
                SerperResponse.ImageResult imageResult = objectMapper.treeToValue(
                        firstImage,
                        SerperResponse.ImageResult.class
                );
                result.setImage(imageResult);
                log.info("Successfully found image for query: {}", query);
            } else {
                log.warn("No images found for query: {}", query);
            }

            return result;

        } catch (UnirestException e) {
            log.error("Error making API request: {}", e.getMessage());
            throw new RuntimeException("Failed to connect to Serper API", e);
        } catch (JsonProcessingException e) {
            log.error("Error parsing API response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse API response", e);
        } catch (Exception e) {
            log.error("Unexpected error during search: {}", e.getMessage());
            throw new RuntimeException("Error performing search", e);
        }
    }

    private void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            log.error("Received empty search query");
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
}