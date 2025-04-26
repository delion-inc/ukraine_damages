package com.example.ukrdamagereport.service.impl;

import com.example.ukrdamagereport.Config.SerperConfig;
import com.example.ukrdamagereport.dto.serper.req.SerperRequest;
import com.example.ukrdamagereport.dto.serper.res.SerperResponse;
import com.example.ukrdamagereport.service.SerperApiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
@RequiredArgsConstructor
public class SerperApiServiceImpl implements SerperApiService {

    private static final String DESTRUCTION_KEYWORD = "destruction";
    private final RestTemplate restTemplate;
    private final SerperConfig serperConfig;

    @Override
    public SerperResponse search(String query) {
        log.info("Starting search query: {}", query);
        validateQuery(query);

        try {
            String enhancedQuery = enhanceQueryWithDestruction(query);
            HttpEntity<SerperRequest> entity = createRequestEntity(enhancedQuery);

            log.debug("Sending request to Serper API with enhanced query: {}", enhancedQuery);
            SerperResponse response = restTemplate.postForObject(
                    serperConfig.getApiUrl(),
                    entity,
                    SerperResponse.class
            );

            if (response == null) {
                throw new RuntimeException("Received empty response from Serper API");
            }

            log.info("Search query completed successfully");
            return response;

        } catch (RestClientException e) {
            log.error("Error connecting to Serper API: {}", e.getMessage());
            throw new RuntimeException("Failed to connect to Serper API", e);
        } catch (Exception e) {
            log.error("Unexpected error during search execution: {}", e.getMessage());
            throw new RuntimeException("Error performing search", e);
        }
    }

    /**
     * Enhances the search query by adding destruction keyword
     * @param originalQuery original user query
     * @return enhanced query with destruction keyword
     */
    private String enhanceQueryWithDestruction(String originalQuery) {
        String trimmedQuery = originalQuery.trim();
        if (trimmedQuery.toLowerCase().contains(DESTRUCTION_KEYWORD)) {
            return trimmedQuery;
        }
        return String.format("%s %s", trimmedQuery, DESTRUCTION_KEYWORD);
    }

    /**
     * Validates the search query
     * @param query search query to validate
     * @throws IllegalArgumentException if query is null or empty
     */
    private void validateQuery(String query) {
        if (query == null || query.trim().isEmpty()) {
            log.error("Received empty search query");
            throw new IllegalArgumentException("Search query cannot be empty");
        }
    }

    /**
     * Creates HTTP entity with headers and request body
     * @param query search query
     * @return prepared HTTP entity
     */
    private HttpEntity<SerperRequest> createRequestEntity(String query) {
        return new HttpEntity<>(createRequest(query), createHeaders());
    }

    /**
     * Creates HTTP headers with API key and content type
     * @return configured HTTP headers
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-KEY", serperConfig.getApiKey());
        return headers;
    }

    /**
     * Creates search request object
     * @param query search query
     * @return prepared request object
     */
    private SerperRequest createRequest(String query) {
        SerperRequest request = new SerperRequest();
        request.setQ(query);
        return request;
    }
}