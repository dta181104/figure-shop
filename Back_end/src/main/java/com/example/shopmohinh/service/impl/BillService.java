package com.example.shopmohinh.service.impl;

import com.example.shopmohinh.dto.request.BillUpdateRequest;
import com.example.shopmohinh.dto.response.BillResponse;
import com.example.shopmohinh.entity.Bill;
import com.example.shopmohinh.exception.AppException;
import com.example.shopmohinh.exception.ErrorCode;
import com.example.shopmohinh.mapper.BillMapper;
import com.example.shopmohinh.repository.BillRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillService {
    BillRepository billRepository;
    BillMapper billMapper;
    UserService userService;

    @PreAuthorize("hasAuthority('SHOW_BILL')")
    public List<BillResponse> getAllBills() {
        return billRepository.findAll().stream()
                .map(billMapper::toBillResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('SHOW_BILL')")
    public BillResponse getBillById(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)); // Consider creating a specific error code for bill
        return billMapper.toBillResponse(bill);
    }

    @PreAuthorize("hasAuthority('SHOW_BILL')")
    public List<BillResponse> getBillsByCustomerId(Long customerId) {
        return billRepository.findByCustomerId(customerId).stream()
                .map(billMapper::toBillResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('UPDATE_BILL')")
    public BillResponse updateBill(Long id, BillUpdateRequest request) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        billMapper.updateBill(bill, request);
        bill.setUpdatedDate(LocalDateTime.now());
        
        try {
             String userName = userService.getMyInfo().getUsername();
             bill.setUpdatedBy(userName);
        } catch (Exception e) {
             // Handle case where user might not be logged in or other issues
        }

        return billMapper.toBillResponse(billRepository.save(bill));
    }

    @PreAuthorize("hasAuthority('DELETE_BILL')")
    public void deleteBill(Long id) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        
        // Soft delete
        bill.setDeleted(true);
        billRepository.save(bill);
    }
}
