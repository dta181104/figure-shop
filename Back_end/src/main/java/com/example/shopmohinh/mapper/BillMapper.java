package com.example.shopmohinh.mapper;

import com.example.shopmohinh.dto.request.BillUpdateRequest;
import com.example.shopmohinh.dto.response.BillResponse;
import com.example.shopmohinh.entity.Bill;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BillMapper {
    BillResponse toBillResponse(Bill bill);

    void updateBill(@MappingTarget Bill bill, BillUpdateRequest request);
}
