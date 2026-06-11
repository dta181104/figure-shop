package com.example.shopmohinh.dto.search;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductSearch extends SearchDto {
    private String code = null;

    private String name = null;

    private int status;

    private Double height;

    private Double weight;

    private BigDecimal price;

    private String keyword;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Long categoryId;

    private String sortBy;

    private String sortDirection;

    private Boolean deleted;
}
