package com.example.shopmohinh.dto.request;

import lombok.Data;

@Data
public class BillUpdateRequest {
    private String status;
    private String customerName;
    private String phone;
    private String email;
    private String address;
    private String note;
}
