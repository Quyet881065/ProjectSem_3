package com.web.shopflower.service;

import com.web.shopflower.dto.response.FileDataResponse;
import com.web.shopflower.dto.response.FileInfoResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {
    @Value("${app.media.url-prefix}")
    private String urlPrefix;
    // Luôn lưu ở thư mục uploads/flowers trong root của project
    private final Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads", "flowers");

    public FileInfoResponse storeFile(MultipartFile file) throws IOException {

        //  Kiểm tra file null hoặc rỗng
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null");
        }

        // Tạo thư mục nếu chưa có
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        log.info("upload path : {}", uploadDir.toAbsolutePath());

        // Tạo tên file ngẫu nhiên
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);

        log.info("File name: {}", fileName);
        log.info("File path : {}", filePath);

        // Lưu file
        file.transferTo(filePath.toFile());

        // Trả về URL (ví dụ: /files/flowers/xxx.jpg)
        return FileInfoResponse.builder()
                .url(urlPrefix+ fileName)
                .path(fileName)
                .build();
    }

    public Resource loadFileAsResource(String fileName) throws IOException {
        Path filePath = uploadDir.resolve(fileName).normalize();
        log.info("Looking for file at path: {}", filePath.toAbsolutePath());
        if (!Files.exists(filePath)) {
            log.error("File not found: {}", fileName);
            throw new IOException("File not found: " + fileName);
        }
        return new UrlResource(filePath.toUri());
    }

}
