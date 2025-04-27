package com.example.ukrdamagereport.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Component
public class FileStorageUtil {

    @Value("${file.upload.path:src/main/resources/static/images}")
    private String uploadPath;

    @Value("${app.domain}")
    private String domain;

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Files.createDirectories(Paths.get(uploadPath));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadPath, filename);

        Files.copy(file.getInputStream(), filePath);

        return domain + "/images/" + filename;
    }

    public String downloadImageFromUrl(String imageUrl) {
        try {
            Files.createDirectories(Paths.get(uploadPath));
            
            String originalFileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
                    .replaceAll("[^a-zA-Z0-9.-]", "_");
            String filename = UUID.randomUUID() + "_" + originalFileName;
            Path destinationFile = Paths.get(uploadPath, filename);
            
            log.info("Downloading image from URL: {} to {}", imageUrl, destinationFile);
            
            try (InputStream in = new URL(imageUrl).openStream()) {
                Files.copy(in, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }
            
            log.info("Successfully downloaded and saved image to: {}", destinationFile);
            return domain + "/images/" + filename;
            
        } catch (IOException e) {
            log.error("Failed to download image from URL: {}", imageUrl, e);
            return null;
        }
    }
}