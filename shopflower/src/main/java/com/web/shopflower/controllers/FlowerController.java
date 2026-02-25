package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.FlowerRequest;
import com.web.shopflower.dto.response.FileDataResponse;
import com.web.shopflower.dto.response.FileResponse;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.service.impl.FileStorageService;
import com.web.shopflower.service.impl.FlowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/flowers")
@RequiredArgsConstructor
public class FlowerController {

    private final FlowerService flowerService;
    private final FileStorageService fileStorageService;


    @GetMapping("")
    ApiResponse<List<FlowerResponse>> getAllFlowers(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "relevant") String sort){
        return flowerService.getAllFlower(category, search, sort);
    }


    @GetMapping("/{id}")
    FlowerResponse getFlower(@PathVariable String id){
        return flowerService.getFlower(id);
    }
    

    // API upload ảnh
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileResponse uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return flowerService.uploadFile(file); // Trả về URL hoặc tên file
    }

    // get image
    @GetMapping("/media/download/{fileName:.+}")
    ResponseEntity<Resource> downloadMedia(@PathVariable String fileName){
        FileDataResponse fileDataResponse = flowerService.download(fileName);
        return ResponseEntity.<Resource>ok()
                .header(HttpHeaders.CONTENT_TYPE, fileDataResponse.getContentType())
                .body(fileDataResponse.getResource());
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FlowerResponse createFlower(@ModelAttribute FlowerRequest request) throws IOException {
        return flowerService.createFlower(request);
    }

    @GetMapping("/total")
    ApiResponse<Long> getTotalFlowers(){
        long total = flowerService.getTotalFlowers();
        return ApiResponse.<Long>builder()
                .results(total)
                .message("success")
                .build();
    }
    @DeleteMapping("/{id}")
    void deleteFlower(@PathVariable String id){
        flowerService.deleteFlower(id);
    }
}
