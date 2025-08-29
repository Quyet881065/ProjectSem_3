package com.web.shopflower.controllers;

import com.web.shopflower.dto.request.FlowerRequest;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.models.FlowerEntity;
import com.web.shopflower.service.FlowerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class FlowerController {

    @Autowired
    private FlowerService flowerService;

    @GetMapping("")
    List<FlowerResponse> getAllFlowers(){
        return flowerService.getAllFlower();
    }

    @GetMapping("/{id}")
    FlowerResponse getFlower(@PathVariable String id){
        return flowerService.getFlower(id);
    }

    @PostMapping("/create")
     Object createFlower(@RequestBody FlowerRequest request){
       return flowerService.createFlower(request);
    }
}
