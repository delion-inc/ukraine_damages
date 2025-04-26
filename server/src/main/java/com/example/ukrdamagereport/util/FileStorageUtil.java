package com.example.ukrdamagereport.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileStorageUtil {

    @Value("${file.upload.path:src/main/resources/static/images}")
    private String uploadPath;

    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        Files.createDirectories(Paths.get(uploadPath));

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadPath, filename);

        Files.copy(file.getInputStream(), filePath);

        return "/images/" + filename;
    }

    public void deleteFile(String filePath) {
        if (filePath == null) return;

        try {
            String filename = filePath.substring(filePath.lastIndexOf('/') + 1);
            Path fullPath = Paths.get(uploadPath, filename);
            Files.deleteIfExists(fullPath);
        } catch (IOException e) {
            // Log error but don't throw
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }
} 