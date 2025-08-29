package com.web.shopflower.service;

import com.web.shopflower.dto.request.FlowerRequest;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.models.FlowerEntity;
import com.web.shopflower.repository.FlowerRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FlowerService {
    @Autowired
    private FlowerRepository flowerRepository;

    public Object createFlower(FlowerRequest request){
        FlowerEntity flowerEntity = new FlowerEntity();
        flowerEntity.setId(UUID.randomUUID().toString());
        flowerEntity.setProductName(request.getProductName());
        flowerEntity.setPrice(request.getPrice());
        flowerEntity.setYears(request.getYears());
        flowerEntity.setUrl(request.getUrl());

       FlowerEntity saveFlower =  flowerRepository.save(flowerEntity);
       Map<String, Object> result = new HashMap<>();
       result.put("success", true);
       result.put("message", "Flower created flower");
       result.put("data", saveFlower);
       return result;
    }

    public List<FlowerResponse> getAllFlower(){
        List<FlowerEntity> flowers = flowerRepository.findAll();
        List<FlowerResponse> response = new ArrayList<>();
        for(FlowerEntity flower : flowers){
            FlowerResponse flowerResponse = new FlowerResponse();
            flowerResponse.setUrl(flower.getUrl());
            flowerResponse.setYears(flower.getYears());
            flowerResponse.setPrice(flower.getPrice());
            flowerResponse.setProductName(flower.getProductName());
            response.add(flowerResponse);
        }
        return response;
    }

    public FlowerResponse getFlower(String id){
        FlowerEntity flowerEntity = flowerRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("flower not found" + id));
        if(flowerEntity == null){
            return null;
        }
        FlowerResponse flowerResponse = new FlowerResponse();
        flowerResponse.setProductName(flowerEntity.getProductName());
        flowerResponse.setPrice(flowerResponse.getPrice());
        flowerResponse.setYears(flowerResponse.getYears());
        flowerResponse.setUrl(flowerResponse.getUrl());
        return flowerResponse;
    }
}
