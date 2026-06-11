package com.example.shopmohinh.controller;

import com.example.shopmohinh.dto.request.BillUpdateRequest;
import com.example.shopmohinh.dto.response.ApiResponse;
import com.example.shopmohinh.dto.response.BillResponse;
import com.example.shopmohinh.service.impl.BillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillController {
    BillService billService;

    @GetMapping
    public ApiResponse<List<BillResponse>> getAllBills() {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBills())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<BillResponse> getBillById(@PathVariable Long id) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.getBillById(id))
                .build();
    }

    @GetMapping("/user/{customerId}")
    public ApiResponse<List<BillResponse>> getBillsByCustomerId(@PathVariable Long customerId) {
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getBillsByCustomerId(customerId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<BillResponse> updateBill(@PathVariable Long id, @RequestBody BillUpdateRequest request) {
        return ApiResponse.<BillResponse>builder()
                .result(billService.updateBill(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ApiResponse.<Void>builder().build();
    }
}
