package com.example.shopmohinh.mapper;

import com.example.shopmohinh.dto.request.PermissionRequest;
import com.example.shopmohinh.dto.response.PermissionResponse;
import com.example.shopmohinh.entity.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
}
