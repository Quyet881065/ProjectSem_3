package com.web.shopflower.repository;

import com.web.shopflower.models.FlowerEntity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlowerRepository extends JpaRepository<FlowerEntity, String> {
    FlowerEntity findByUrl(String fileName);
    List<FlowerEntity> findByCategoryContainingIgnoreCaseAndProductNameContainingIgnoreCase(
            String category,
            String flowerName,
            Sort sort
    );
}
