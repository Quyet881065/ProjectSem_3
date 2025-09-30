package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.FlowerRequest;
import com.web.shopflower.dto.response.FileDataResponse;
import com.web.shopflower.dto.response.FileResponse;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.models.FlowerEntity;
import com.web.shopflower.service.FileStorageService;
import com.web.shopflower.service.FlowerService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
    ApiResponse<List<FlowerResponse>> getAllFlowers(){
        return flowerService.getAllFlower();
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

    //  API tạo flower (chỉ nhận JSON)
    @PostMapping("/create")
    public FlowerResponse createFlower(@RequestBody FlowerRequest request) {
        return flowerService.createFlower(request);
    }
}
