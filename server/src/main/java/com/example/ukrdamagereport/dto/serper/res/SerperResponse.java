package com.example.ukrdamagereport.dto.serper.res;


import lombok.Data;
import java.util.List;

@Data
public class SerperResponse {
    private SearchParameters searchParameters;
    private List<OrganicResult> organic;
    private List<String> relatedSearches;

    @Data
    public static class SearchParameters {
        private String q;
    }

    @Data
    public static class OrganicResult {
        private String title;
        private String link;
        private String snippet;
        private int position;
    }
}
