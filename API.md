# API Documentation

## Base URL

```text
http://localhost:5000/api
```

---

# Authentication

## Register

**POST** `/auth/register`

Creates a new user account.

### Request

```json
{
  "name": "Deepak",
  "email": "deepak@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

## Login

**POST** `/auth/login`

Authenticates a user and returns a JWT token.

### Request

```json
{
  "email": "deepak@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "token": "<jwt_token>",
    "user": {
      "id": "...",
      "name": "Deepak",
      "email": "deepak@example.com"
    }
  }
}
```

---

## Get Current User

**GET** `/auth/me`

Returns the currently authenticated user.

**Authorization**

```
Bearer <token>
```

---

# Products

## Get All Products

**GET** `/products`

Returns all products.

---

## Get Product By ID

**GET** `/products/:id`

Returns a single product.

---

## Create Product

**POST** `/products`

Creates a new product.

### Request

```json
{
  "sku": "SKU001",
  "name": "Laptop",
  "description": "Gaming Laptop",
  "price": 55000
}
```

---

## Update Product

**PUT** `/products/:id`

Updates an existing product.

### Request

```json
{
  "sku": "SKU001",
  "name": "Laptop Pro",
  "description": "Updated description",
  "price": 60000
}
```

---

## Delete Product

**DELETE** `/products/:id`

Deletes a product.

---

# Stock

## Add Stock

**POST** `/stock/:productId/add`

### Request

```json
{
  "quantity": 20,
  "notes": "New shipment"
}
```

---

## Adjust Stock

**POST** `/stock/:productId/adjust`

### Request

```json
{
  "quantity": -5,
  "notes": "Damaged items"
}
```

Positive quantity increases stock.

Negative quantity decreases stock.

---

## Get Product Stock History

**GET** `/stock/:productId/history`

Returns stock movement history for a product.

---

## Get Complete Stock History

**GET** `/stock/history`

Returns stock movement history for all products.

---

# Orders

## Create Order

**POST** `/orders`

Creates a new order.

### Request

```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ]
}
```

Stock is automatically deducted after successful order creation.

---

## Get Orders

**GET** `/orders`

Returns all orders.

---

## Get Order By ID

**GET** `/orders/:id`

Returns details of a specific order.

---

## Cancel Order

**POST** `/orders/:id/cancel`

Cancels an order and restores the deducted stock.

---

# Dashboard

## Dashboard Summary

**GET** `/dashboard`

Returns dashboard statistics.

### Response includes

* Total Products
* Total Stock
* Pending Orders
* Low Stock Products
* Recent Stock Movements

---

# Authentication

All protected endpoints require the following header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# HTTP Status Codes

| Status | Description           |
| ------ | --------------------- |
| 200    | Request Successful    |
| 201    | Resource Created      |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 404    | Resource Not Found    |
| 409    | Conflict              |
| 500    | Internal Server Error |

---

# Validation

The API validates:

* Required fields
* Unique SKU
* Positive product price
* Valid product IDs
* Available stock before ordering
* Stock cannot become negative
* Invalid JWT tokens
* Duplicate product SKUs
* Duplicate order cancellation
