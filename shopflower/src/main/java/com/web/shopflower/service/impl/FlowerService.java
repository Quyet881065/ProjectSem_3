package com.web.shopflower.service.impl;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.FlowerRequest;
import com.web.shopflower.dto.response.FileDataResponse;
import com.web.shopflower.dto.response.FileResponse;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.models.FlowerEntity;
import com.web.shopflower.repository.FlowerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class FlowerService {
    @Value("${app.media.url-prefix}")
    private String urlPrefix;
    @Autowired
    private FlowerRepository flowerRepository;
    private final FileStorageService fileStorageService;

    public FlowerResponse createFlower(FlowerRequest request )  {

        FlowerEntity flowerEntity = new FlowerEntity();
        flowerEntity.setProductName(request.getProductName());
        flowerEntity.setPrice(request.getPrice());
        flowerEntity.setUrl(request.getUrl());
        flowerEntity.setDescription(request.getDescription());
        flowerEntity.setProductsInclude(request.getProductsInclude());

        FlowerEntity savedFlower = flowerRepository.save(flowerEntity);

        FlowerResponse response = new FlowerResponse();
        response.setId(savedFlower.getId());
        response.setFlowerName(savedFlower.getProductName());
        response.setPrice(savedFlower.getPrice());
        response.setUrl(savedFlower.getUrl());
        response.setDescription(savedFlower.getDescription());
        response.setFlowerInclude(savedFlower.getProductsInclude());

        return response;
    }

    public ApiResponse<List<FlowerResponse>> getAllFlower(){
        List<FlowerEntity> flowers = flowerRepository.findAll();
        List<FlowerResponse> response = new ArrayList<>();

        for(FlowerEntity flower : flowers){
            FlowerResponse flowerResponse = new FlowerResponse();
            // Nếu bạn lưu tên file trong DB, tạo url đầy đủ
            String fileName = flower.getUrl(); // giả sử DB lưu fileName, ví dụ "uuid_hoahong.webp"
            if(fileName != null && !fileName.isEmpty()){
                String fullUrl = urlPrefix + fileName;
                flowerResponse.setUrl(fullUrl);
                log.info("full url : {}", fullUrl);
            } else {
                flowerResponse.setUrl(null);
            }
            flowerResponse.setId(flower.getId());
            flowerResponse.setPrice(flower.getPrice());
            flowerResponse.setFlowerName(flower.getProductName());
            flowerResponse.setDescription(flower.getDescription());
            flowerResponse.setFlowerInclude(flower.getProductsInclude());
            response.add(flowerResponse);
        }
       return ApiResponse.<List<FlowerResponse>>builder()
               .statusCode(200)
               .message("success")
                .results(response)
                .build();
    }

    public FlowerResponse getFlower(String id){
        FlowerEntity flowerEntity = flowerRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("flower not found" + id));
        if(flowerEntity == null){
            return null;
        }

        FlowerResponse flowerResponse = new FlowerResponse();
        String fileName = flowerEntity.getUrl();
        if(fileName != null && !fileName.isEmpty()){
            String fullUrl = urlPrefix + fileName;
            flowerResponse.setUrl(fullUrl);
        }
        flowerResponse.setId(flowerEntity.getId());
        flowerResponse.setFlowerName(flowerEntity.getProductName());
        flowerResponse.setPrice(flowerEntity.getPrice());
        flowerResponse.setDescription(flowerEntity.getDescription());
        flowerResponse.setFlowerInclude(flowerEntity.getProductsInclude());
        return flowerResponse;
    }

    public FileDataResponse download(String fileName){
        try {
            if(fileName == null || fileName.isEmpty()){
                throw new RuntimeException("File name is empty!");
            }
            // Load file từ storage
            Resource resource = fileStorageService.loadFileAsResource(fileName);

            // Lấy content type, fallback sang application/octet-stream
            String contentType = Files.probeContentType(resource.getFile().toPath());
            if(contentType == null){
                contentType = "application/octet-stream";
            }

            return FileDataResponse.builder()
                    .contentType(contentType)
                    .resource(resource)
                    .build();

        } catch (IOException e) {
            log.error("File not found or error loading file: {}", fileName, e);
            throw new RuntimeException("Could not download file: " + fileName, e);
        }
    }
    public void deleteFlower(String id){
        flowerRepository.deleteById(id);
    }

    public FileResponse uploadFile(MultipartFile file) throws IOException {
        // Store file
        var fileInfo = fileStorageService.storeFile(file);

        return FileResponse.builder()
                .url(fileInfo.getUrl())
                .build();
    }
    public long getTotalFlowers(){
        return flowerRepository.count();
    }
}
