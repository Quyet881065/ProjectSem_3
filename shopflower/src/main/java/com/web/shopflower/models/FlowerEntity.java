package com.web.shopflower.models;

import jakarta.persistence.*;

@Entity
@Table(name = "flower")
public class FlowerEntity {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private String id;
    private String productName;
    private int years ;
    private Double price;
    private String url;

    public String getId(){
        return id;
    }
    public void setId(String id){
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getYears() {
        return years;
    }

    public void setYears(int years) {
        this.years = years;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

}
