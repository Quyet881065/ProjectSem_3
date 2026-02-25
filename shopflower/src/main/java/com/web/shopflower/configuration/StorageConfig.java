package com.web.shopflower.configuration;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Component
public class StorageConfig {
    private final Path uploadDir =
            Paths.get(System.getProperty("user.dir"), "uploads", "flowers");

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
                log.info("Upload directory created at: {}", uploadDir.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folder", e);
        }
    }
}
