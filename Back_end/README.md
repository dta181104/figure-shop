# API Documentation — Figure Shop Back-end

Tài liệu này mô tả tất cả các API có trong project `shopmohinh` (backend).
Nội dung gồm: đường dẫn (path), phương thức HTTP, tham số (path/query/body), DTO sử dụng, cấu trúc response và ghi chú xác thực.

Lưu ý/Assumptions:
- Các endpoint trả về kiểu chung `ApiResponse<T>` (khung của project).
- Một số endpoint yêu cầu xác thực (JWT) — tôi ghi chú "Requires authentication" cho các endpoint thao tác dữ liệu người dùng/administration/payment. Nếu cần chi tiết roles/permission chính xác, vui lòng cho biết hoặc kiểm tra cấu hình security.
- Tên DTO là tên lớp trong `src/main/java/com/example/shopmohinh/dto/request` hoặc `.../dto/response`.

---

Base URL: (tùy môi trường) `http://{host}:{port}`

1) Authentication

- POST /auth/token
  - Mô tả: Đăng nhập, nhận access/refresh token
  - Body: `AuthenticationRequest {username: String, pass: String}` (ví dụ: username, password)
  - Response: `ApiResponse<AuthenticationResponse> (code: Integer, message: String, result: {token: String, authenticated: boolean})`

- POST /auth/introspect
  - Mô tả: Kiểm tra token
  - Body: `IntrospectRequest {token: String}`
  - Response: `ApiResponse<IntrospectResponse> (code: Integer, message: String, result: {valid: boolean})`

- POST /auth/logout
  - Mô tả: Logout (hủy token)
  - Body: `LogoutRequest {token: String}`
  - Response: `ApiResponse<Void> (code: Integer, message: String)`

- POST /auth/refresh
  - Mô tả: Refresh access token từ refresh token
  - Body: `RefeshRequest {token: String}`
  - Response: `ApiResponse<AuthenticationResponse> (code: Integer, message: String, result: {token: String, authenticated: boolean})`

- POST /auth/forgot-password
  - Mô tả: Gửi email khôi phục mật khẩu (sinh mã xác thực)
  - Query params: `email`, `username`
  - Response: `ApiResponse<String> (code: Integer, message: String, result: String)` (thông báo / token tạm)

- POST /auth/verify-code
  - Mô tả: Xác thực mã khôi phục
  - Query params: `email`, `token`
  - Response: `ApiResponse<String> (code: Integer, message: String, result: String)`

- POST /auth/reset-password
  - Mô tả: Đặt lại mật khẩu
  - Query params: `email`, `newPassword`
  - Response: `ApiResponse<String> (code: Integer, message: String, result: String)`

---

2) Users

- GET /users/myInfo
  - Mô tả: Lấy thông tin của user đang đăng nhập
  - Auth: Requires authentication
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- PUT /users/{code}
  - Mô tả: Cập nhật thông tin user (theo code)
  - Path: `code`
  - Body: `UserUpdateRequest {name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, pass: String, updatedDate: LocalDateTime, updatedBy: String, roles: List<Long>, deleted: Boolean, avatar: String}`
  - Auth: Requires authentication
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- DELETE /users/{code}
  - Mô tả: Xóa tài khoản (theo code)
  - Path: `code`
  - Auth: Requires authentication
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- POST /users/register
  - Mô tả: Đăng ký user mới
  - Body: `UserCreationRequest {code: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, pass: String, avatar: String, roles: List<String>}` (sử dụng @ModelAttribute trong controller — có thể gửi form-data)
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

---

3) Admin
(Endpoints dành cho quản trị - thường yêu cầu role ADMIN)

- POST /admin/create
  - Mô tả: Tạo account mới (admin)
  - Body: `UserCreationRequest {code: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, pass: String, avatar: String, roles: List<String>}`
  - Auth: Requires authentication (admin)
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- GET /admin/accounts
  - Mô tả: Lấy danh sách tất cả account
  - Auth: Requires authentication (admin)
  - Response: `ApiResponse<List<UserResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, email: String, ...}>)`

- GET /admin/find/{code}
  - Mô tả: Tìm user theo code
  - Path: `code`
  - Auth: Requires authentication (admin)
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- PUT /admin/update/{code}
  - Mô tả: Cập nhật account theo code
  - Path: `code`
  - Body: `UserUpdateRequest {name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, pass: String, updatedDate: LocalDateTime, updatedBy: String, roles: List<Long>, deleted: Boolean, avatar: String}`
  - Auth: Requires authentication (admin)
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

- DELETE /admin/delete/{code}
  - Mô tả: Xóa account theo code
  - Path: `code`
  - Auth: Requires authentication (admin)
  - Response: `ApiResponse<UserResponse> (code: Integer, message: String, result: {id: Long, code: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, name: String, sex: Boolean, address: String, phone: String, email: String, status: String, date: LocalDate, username: String, deleted: Boolean, avatar: String, roles: Set<RoleResponse>})`

---

4) Product

- POST /product
  - Mô tả: Tạo product
  - Body: `ProductRequest {code: String, status: int, name: String, description: String, height: Double, weight: Double, quantity: Integer, price: BigDecimal, images: List<{imageUrl: String, imageFile: MultipartFile, isMainImage: Boolean}>}`
  - Auth: Typically requires authentication (admin/vendor) — check security config
  - Response: `ApiResponse<ProductResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, description: String, status: int, height: Double, weight: Double, quantity: Integer, price: BigDecimal, category_id: Long, deleted: Boolean, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, images: List<ImageResponse>})`

- GET /product
  - Mô tả: Lấy danh sách product theo filter/paging
  - Query params: theo `ProductSearch` (controller nhận `ProductSearch` object)
  - Response: `ApiResponse<Page<ProductResponse>> (code: Integer, message: String, result: Page<{id: Long, code: String, name: String, ...}>)`

- GET /product/{id}
  - Mô tả: Lấy chi tiết product theo id (Long)
  - Path: `id`
  - Response: `ApiResponse<ProductResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, description: String, status: int, height: Double, weight: Double, quantity: Integer, price: BigDecimal, category_id: Long, deleted: Boolean, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, images: List<ImageResponse>})`

- DELETE /product/{code}
  - Mô tả: Xóa product theo code
  - Path: `code`
  - Auth: Requires authentication
  - Response: `ApiResponse<ProductResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, description: String, status: int, height: Double, weight: Double, quantity: Integer, price: BigDecimal, category_id: Long, deleted: Boolean, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, images: List<ImageResponse>})` (trả rỗng khi thành công)

- PUT /product/{code}
  - Mô tả: Cập nhật product theo code
  - Path: `code`
  - Body: `ProductRequest {code: String, status: int, name: String, description: String, height: Double, weight: Double, quantity: Integer, price: BigDecimal, images: List<{imageUrl: String, imageFile: MultipartFile, isMainImage: Boolean}>}`
  - Auth: Requires authentication
  - Response: `ApiResponse<ProductResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, description: String, status: int, height: Double, weight: Double, quantity: Integer, price: BigDecimal, category_id: Long, deleted: Boolean, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, images: List<ImageResponse>})`

---

5) Category

- POST /category
  - Mô tả: Tạo category
  - Body: `CategoryRequest {code: String, name: String, status: String}`
  - Response: `ApiResponse<CategoryResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, status: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

- GET /category
  - Mô tả: Lấy tất cả category
  - Response: `ApiResponse<List<CategoryResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, status: String, ...}>)`

- DELETE /category/{code}
  - Mô tả: Xóa category theo code
  - Path: `code`
  - Response: `ApiResponse<CategoryResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, status: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

- PUT /category/{code}
  - Mô tả: Cập nhật category
  - Path: `code`
  - Body: `CategoryRequest {code: String, name: String, status: String}`
  - Response: `ApiResponse<CategoryResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, status: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

- GET /category/{page}
  - Mô tả: Lấy category theo paging (page bắt đầu từ 1)
  - Path: `page` (Integer)
  - Response: `ApiResponse<List<CategoryResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, status: String, ...}>)`

- GET /category/totalPage
  - Mô tả: Lấy tổng số page (kiểu trả Double theo code)
  - Response: `ApiResponse<Double> (code: Integer, message: String, result: Double)`

- GET /category/find?name={name}&status={status}&page={page}
  - Mô tả: Tìm category theo tên/trạng thái có phân trang
  - Query: `name` (optional), `status` (optional), `page` (required)
  - Response: `ApiResponse<List<CategoryResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, status: String, ...}>)`

- GET /category/findTotalPage?name={name}&status={status}
  - Mô tả: Lấy tổng page cho tìm kiếm
  - Query: `name`, `status` (optional)
  - Response: `ApiResponse<List<CategoryResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, status: String, ...}>)` (controller trả list nhưng ý nghĩa là total pages)

---

6) Brand

- GET /brand
  - Mô tả: Lấy tất cả brand
  - Response: `ApiResponse<List<BrandResponse>> (code: Integer, message: String, result: List<{code: String, name: String, status: String, description: String, ...}>)`

- DELETE /brand/{code}
  - Mô tả: Xóa brand theo code
  - Path: `code`
  - Response: `ApiResponse<BrandResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- POST /brand
  - Mô tả: Tạo brand
  - Body: `BrandRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<BrandResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- PUT /brand/{code}
  - Mô tả: Cập nhật brand theo code
  - Path: `code`
  - Body: `BrandRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<BrandResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

---

7) Material

- GET /material
  - Mô tả: Lấy tất cả material
  - Response: `ApiResponse<List<MaterialResponse>> (code: Integer, message: String, result: List<{code: String, name: String, status: String, description: String, ...}>)`

- DELETE /material/{code}
  - Mô tả: Xóa material
  - Path: `code`
  - Response: `ApiResponse<MaterialResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- POST /material
  - Mô tả: Tạo material
  - Body: `MaterialRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<MaterialResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- PUT /material/{code}
  - Mô tả: Cập nhật material
  - Path: `code`
  - Body: `MaterialRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<MaterialResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

---

8) Size

- GET /size
  - Mô tả: Lấy tất cả size
  - Response: `ApiResponse<List<SizeResponse>> (code: Integer, message: String, result: List<{code: String, name: String, status: String, description: String, ...}>)`

- DELETE /size/{code}
  - Mô tả: Xóa size
  - Path: `code`
  - Response: `ApiResponse<SizeResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- POST /size
  - Mô tả: Tạo size
  - Body: `SizeRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<SizeResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

- PUT /size/{code}
  - Mô tả: Cập nhật size
  - Path: `code`
  - Body: `SizeRequest {code: String, name: String, status: String, description: String}`
  - Response: `ApiResponse<SizeResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, description: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String})`

---

9) Roles

- POST /roles
  - Mô tả: Tạo role
  - Body: `RoleRequest {code: String, name: String, status: String, permissions: Set<Long>}`
  - Response: `ApiResponse<RoleResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, permissions: Set<PermissionResponse>, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

- GET /roles
  - Mô tả: Lấy tất cả role
  - Response: `ApiResponse<List<RoleResponse>> (code: Integer, message: String, result: List<{code: String, name: String, status: String, ...}>)`

- DELETE /roles/{id}
  - Mô tả: Xóa role theo id (Long)
  - Path: `id`
  - Response: `ApiResponse<Void> (code: Integer, message: String)`

- PUT /roles/{roleID}
  - Mô tả: Cập nhật role
  - Path: `roleID` (Long)
  - Body: `RoleRequest {code: String, name: String, status: String, permissions: Set<Long>}`
  - Response: `ApiResponse<RoleResponse> (code: Integer, message: String, result: {code: String, name: String, status: String, permissions: Set<PermissionResponse>, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

---

10) Permissions

- POST /permissions
  - Mô tả: Tạo permission
  - Body: `PermissionRequest {code: String, name: String, status: String}`
  - Response: `ApiResponse<PermissionResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, status: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

- GET /permissions
  - Mô tả: Lấy tất cả permission
  - Response: `ApiResponse<List<PermissionResponse>> (code: Integer, message: String, result: List<{id: Long, code: String, name: String, status: String, ...}>)`

- DELETE /permissions/{code}
  - Mô tả: Xóa permission theo code
  - Path: `code`
  - Response: `ApiResponse<PermissionResponse> (code: Integer, message: String, result: {id: Long, code: String, name: String, status: String, createdDate: LocalDateTime, updatedDate: LocalDateTime, createdBy: String, updatedBy: String, deleted: Boolean})`

---

11) Cart Detail

- POST /cart-detail
  - Mô tả: Thêm sản phẩm vào cart (CartDetail)
  - Body: `CartDetailRequest {productId: Long, quantity: Integer}`
  - Response: `ApiResponse<CartDetailResponse> (code: Integer, message: String, result: {id: Long, code: String, quantity: Integer, cartCode: String, username: String})`

- DELETE /cart-detail
  - Mô tả: Xóa các product khỏi cart (controller nhận List<Long> productIds) - kiểm tra client gửi như query/body
  - Body or Query: list productIds
  - Response: `ApiResponse<String> (code: Integer, message: String, result: String)`

---

12) Payment (VNPAY / Momo)

- POST /payment/submitOrder
  - Mô tả: Tạo order VNPAY, trả về URL thanh toán
  - Query params: `amount` (int), `orderInfo` (String)
  - Response: text URL (ResponseEntity<String>)

- GET /payment/vnpay-payment
  - Mô tả: Callback/return từ VNPAY, controller parse request params
  - Response: JSON Map gồm: paymentStatus, orderId, totalPrice, paymentTime, transactionId

- POST /momo
  - Mô tả: Tạo yêu cầu thanh toán MOMO
  - Query params: `amount`, `orderInfo`
  - Response: String (mảng/URL tuỳ service)

- GET /momo/order-status
  - Mô tả: Kiểm tra trạng thái thanh toán MOMO
  - Body: String paymentId
  - Response: String

---

