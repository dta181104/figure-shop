package com.example.shopmohinh.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BillResponse {
    private Long id;
    private Long paymentId;
    private Long customerId;
    private Long staffId;
    private String code;
    private Float feeShip;
    private String customerName;
    private String phone;
    private String email;
    private String note;
    private Float totalMoney;
    private String status;
    private Boolean deleted;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private String updatedBy;
    private String createdBy;
    private String address;
}
