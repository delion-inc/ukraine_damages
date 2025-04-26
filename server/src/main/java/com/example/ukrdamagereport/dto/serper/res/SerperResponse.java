package com.example.ukrdamagereport.dto.serper.res;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SerperResponse {
    private SearchParameters searchParameters;
    private List<ImageResult> images;  // Додано поле для зображень

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SearchParameters {
        private String q;
        private String gl;
        private String hl;
        private String type;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageResult {
        private String title;
        private String imageUrl;
        private String imageWidth;
        private String imageHeight;
        private String thumbnailUrl;
        private String source;
        private String domain;
        private String link;
    }
}