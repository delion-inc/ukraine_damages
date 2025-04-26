package com.example.ukrdamagereport.dto.serper.res;

import lombok.Data;

@Data
public class SerperResponse {
    private ImageResult image;

    @Data
    public static class ImageResult {
        private String title;
        private String link;
        private String imageUrl;
        private String originalImageUrl;
        private String source;
        private String domain;
    }
}