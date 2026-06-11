# API Documentation

## Admin API

### POST /admin/create
- **Request Body:** None

### GET /admin/accounts
- **Query Parameters:** pageIndex (int, optional, default: 1), pageSize (int, optional, default: 10), keyword (String, optional)
- **Request Body:** None
- **Response:** Paginated list of UserResponse objects

### GET /admin/find/{code}
- **Request Body:** None

### PUT /admin/update/{code}
- **Request Body:** None

### DELETE /admin/delete/{code}
- **Request Body:** None

## Authentication API

### POST /auth/token
- **Request Body:** AuthenticationRequest
`json
{
}
`

### POST /auth/introspect
- **Request Body:** IntrospectRequest
`json
{
}
`

### POST /auth/logout
- **Request Body:** LogoutRequest
`json
{
}
`

### POST /auth/refresh
- **Request Body:** RefeshRequest
`json
{
}
`

### POST /auth/forgot-password
- **Query Parameters:** email (String), username (String)
- **Request Body:** None

### POST /auth/verify-code
- **Query Parameters:** email (String), token (String)
- **Request Body:** None

### POST /auth/reset-password
- **Query Parameters:** email (String), newPassword (String)
- **Request Body:** None

## Bill API

### GET /bills
- **Description:** Retrieve all bills
- **Request Body:** None
- **Response:**
```json
[
    {
        "id": 1,
        "paymentId": 1,
        "customerId": 1,
        "staffId": 1,
        "code": "HD001",
        "feeShip": 25.0,
        "customerName": "Nguyễn Văn A",
        "phone": "0987654321",
        "email": "nguyenvana@example.com",
        "note": "Giao hàng nhanh",
        "totalMoney": 1500.0,
        "status": "Đang xử lý",
        "deleted": false,
        "createdDate": "2024-05-22T10:00:00",
        "updatedDate": "2024-05-22T10:00:00",
        "updatedBy": "admin",
        "createdBy": "admin",
        "address": "123 Đường ABC, Quận 1, TP.HCM"
    }
]
```

### GET /bills/{id}
- **Description:** Retrieve a specific bill by its ID
- **Path Variables:** id (Long)
- **Request Body:** None
- **Response:**
```json
{
    "id": 1,
    "paymentId": 1,
    "customerId": 1,
    "staffId": 1,
    "code": "HD001",
    "feeShip": 25.0,
    "customerName": "Nguyễn Văn A",
    "phone": "0987654321",
    "email": "nguyenvana@example.com",
    "note": "Giao hàng nhanh",
    "totalMoney": 1500.0,
    "status": "Đang xử lý",
    "deleted": false,
    "createdDate": "2024-05-22T10:00:00",
    "updatedDate": "2024-05-22T10:00:00",
    "updatedBy": "admin",
    "createdBy": "admin",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

### GET /bills/user/{customerId}
- **Description:** Retrieve all bills for a specific customer
- **Path Variables:** customerId (Long)
- **Request Body:** None
- **Response:**
```json
[
    {
        "id": 1,
        "paymentId": 1,
        "customerId": 1,
        "staffId": 1,
        "code": "HD001",
        "feeShip": 25.0,
        "customerName": "Nguyễn Văn A",
        "phone": "0987654321",
        "email": "nguyenvana@example.com",
        "note": "Giao hàng nhanh",
        "totalMoney": 1500.0,
        "status": "Đang xử lý",
        "deleted": false,
        "createdDate": "2024-05-22T10:00:00",
        "updatedDate": "2024-05-22T10:00:00",
        "updatedBy": "admin",
        "createdBy": "admin",
        "address": "123 Đường ABC, Quận 1, TP.HCM"
    }
]
```

### PUT /bills/{id}
- **Description:** Update an existing bill
- **Path Variables:** id (Long)
- **Request Body:** BillUpdateRequest
```json
{
    "status": "Đã giao hàng",
    "customerName": "Nguyễn Văn B",
    "phone": "0912345678",
    "email": "nguyenvanb@example.com",
    "address": "456 Đường XYZ, Quận 2, TP.HCM",
    "note": "Khách đã nhận hàng"
}
```
- **Response:** Returns the updated BillResponse object

### DELETE /bills/{id}
- **Description:** Soft delete a bill
- **Path Variables:** id (Long)
- **Request Body:** None
- **Response:** Empty response body with 200 OK status

## Brand API

### GET /brand
- **Request Body:** None

### DELETE /brand/{code}
- **Request Body:** None

### POST /brand
- **Request Body:** None

### PUT /brand/{code}
- **Request Body:** None

## CartDetail API

### POST /cart-detail
- **Request Body:** CartDetailRequest
`json
{
}
`

### DELETE /cart-detail
- **Request Body:** None

## Category API

### POST /category
- **Request Body:** CategoryRequest
`json
{
}
`

### GET /category
- **Request Body:** None

### DELETE /category/{code}
- **Request Body:** None

### PUT /category/{code}
- **Request Body:** None

### GET /category/{page}
- **Request Body:** None

### GET /category/totalPage
- **Request Body:** None

### GET /category/find
- **Request Body:** None

### GET /category/findTotalPage
- **Request Body:** None

## Material API

### GET /material
- **Request Body:** None

### DELETE /material/{code}
- **Request Body:** None

### POST /material
- **Request Body:** None

### PUT /material/{code}
- **Request Body:** None

## Momo API

### POST /momo
- **Request Body:** None

### GET /momo/order-status
- **Request Body:** String
`json
// No explicit structure found
`

## Payment API

### POST /payment/submitOrder
- **Request Body:** None

### GET /payment/vnpay-payment
- **Request Body:** None

## Permission API

### POST /permissions
- **Request Body:** PermissionRequest
`json
{
}
`

### GET /permissions
- **Request Body:** None

### DELETE /permissions/{code}
- **Request Body:** None

## Product API

### POST /product
- **Request Body:** ProductRequest
`json
{
}
`

### GET /product
- **Query Parameters:**
    - `pageIndex` (int, optional, default: 1)
    - `pageSize` (int, optional, default: 10)
    - `keyword` (String, optional) - Search by product description
    - `minPrice` (BigDecimal, optional) - Minimum price
    - `maxPrice` (BigDecimal, optional) - Maximum price
    - `categoryId` (Long, optional) - Filter by category ID
    - `sortBy` (String, optional) - Sort by: `HEIGHT`, `NAME`, `UPDATED_DATE`, `PRICE`, `WEIGHT`
    - `sortDirection` (String, optional) - Sort direction: `ASC`, `DESC`
- **Request Body:** None
- **Response:** Paginated list of ProductResponse objects

### GET /product/{id}
- **Path Variables:** id (Long)
- **Request Body:** None

### DELETE /product/{code}
- **Request Body:** None

### PUT /product/{code}
- **Request Body:** None

## Role API

### POST /roles
- **Request Body:** RoleRequest
`json
{
}
`

### GET /roles
- **Request Body:** None

### DELETE /roles/{id}
- **Request Body:** None

### PUT /roles/{roleID}
- **Request Body:** None

## Size API

### GET /size
- **Request Body:** None

### DELETE /size/{code}
- **Request Body:** None

### POST /size
- **Request Body:** None

### PUT /size/{code}
- **Request Body:** None

## User API

### GET /users/myInfo
- **Request Body:** None

### PUT /users/{code}
- **Request Body:** None

### DELETE /users/{code}
- **Request Body:** None

### POST /users/register
- **Request Body:** None