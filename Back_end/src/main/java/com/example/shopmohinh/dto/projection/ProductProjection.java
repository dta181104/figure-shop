package com.example.shopmohinh.dto.projection;

import java.math.BigDecimal;

public interface ProductProjection {
    Long getId();
    Long getIdImage();
    String getCode();
    String getName();
    String getDescription();
    Double getHeight();
    BigDecimal getPrice();
    Integer getQuantity();
    Integer getStatus();
    Double getWeight();
    Boolean getDeleted();
    Boolean getMainImage();
    String getImageUrl();
}
