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
import org.springframework.data.domain.Sort;
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

    private final FlowerRepository flowerRepository;
    private final FileStorageService fileStorageService;

    public FlowerResponse createFlower(FlowerRequest request )  {
        String fileName = null;

        System.out.println("BestSeller: " + request.getBestSeller());

        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            try {
                var fileInfo = fileStorageService.storeFile(request.getImageFile());
                fileName = fileInfo.getPath();
            } catch (IOException e) {
                throw new RuntimeException("Failed to store file", e);
            }
        }

        FlowerEntity flowerEntity = new FlowerEntity();
        flowerEntity.setProductName(request.getFlowerName());
        flowerEntity.setPrice(request.getPrice());
        flowerEntity.setUrl(fileName);
        flowerEntity.setDescription(request.getDescription());
        flowerEntity.setProductsInclude(request.getProductsInclude());
        flowerEntity.setCategory(request.getCategory());
        flowerEntity.setBestSeller(request.getBestSeller());

        FlowerEntity savedFlower = flowerRepository.save(flowerEntity);

        FlowerResponse response = new FlowerResponse();
        response.setId(savedFlower.getId());
        response.setFlowerName(savedFlower.getProductName());
        response.setPrice(savedFlower.getPrice());
        response.setUrl(savedFlower.getUrl());
        response.setDescription(savedFlower.getDescription());
        response.setFlowerInclude(savedFlower.getProductsInclude());
        response.setCategory(savedFlower.getCategory());
        response.setBestSeller(savedFlower.getBestSeller());

        return response;
    }

    public ApiResponse<List<FlowerResponse>> getAllFlower(String category, String search, String sort) {

        if(category == null) category = "";
        if(search == null) search = "";

        Sort sorting = Sort.unsorted();

        if("low-high".equals(sort)){
            sorting = Sort.by("price").ascending();
        } else if("high-low".equals(sort)){
            sorting = Sort.by("price").descending();
        }

        List<FlowerEntity> flowers = flowerRepository
                .findByCategoryContainingIgnoreCaseAndProductNameContainingIgnoreCase(
                        category,
                        search,
                        sorting
                );

        List<FlowerResponse> responses = new ArrayList<>();

        for (FlowerEntity flower : flowers) {

            FlowerResponse response = new FlowerResponse();
            response.setId(flower.getId());
            response.setFlowerName(flower.getProductName());
            response.setPrice(flower.getPrice());
            response.setCategory(flower.getCategory());
            response.setUrl(flower.getUrl());
            response.setDescription(flower.getDescription());
            response.setBestSeller(flower.getBestSeller());
            response.setFlowerInclude(flower.getProductsInclude());
            responses.add(response);
        }

        return ApiResponse.<List<FlowerResponse>>builder()
                .results(responses)
                .message("success")
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
        flowerResponse.setCategory(flowerEntity.getCategory());
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
