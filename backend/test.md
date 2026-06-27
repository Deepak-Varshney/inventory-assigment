## 1. बेस सेटअप

1. Postman खोलो
2. Base URL मान लो:
   - `http://localhost:3000/api`

3. हर protected request में `Headers` में:
   - Key: `Authorization`
   - Value: `Bearer <your-token>`

---

## 2. Authentication flow टेस्ट करो

### 2.1 Register user

Endpoint:
- `POST http://localhost:3000/api/auth/register`

Body (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "ADMIN"
}
```

- यह नया user बनाएगा
- अगर email पहले से है तो `409 Email already registered`

### 2.2 Login user

Endpoint:
- `POST http://localhost:3000/api/auth/login`

Body:
```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```

Response में मिलेगा:
- `data.user`
- `data.token`

> यह token आगे सब protected requests में use करना है।

---

## 3. Token validation behavior

### क्या टेस्ट करना है

- बिना `Authorization` header भेजो → `401 No token provided`
- गलत token भेजो → `401 Invalid or expired token`
- सही token के साथ भेजो → request आगे चलेगा

यह validation auth.ts में होती है:
- `authenticate` middleware token चेक करता है
- `isAdmin` middleware role चेक करता है

---

## 4. Product endpoints

### 4.1 Create product (admin only)

Endpoint:
- `POST http://localhost:3000/api/products`

Headers:
- `Authorization: Bearer <admin-token>`

Body:
```json
{
  "sku": "PROD001",
  "name": "Example Product",
  "description": "Test product",
  "price": 250
}
```

- अगर admin नहीं हो तो `403 Admin access required`
- अगर sku duplicate है तो `409 SKU already exists`

### 4.2 List products

Endpoint:
- `GET http://localhost:3000/api/products`

Headers:
- `Authorization: Bearer <token>`

- यह सभी products दिखाएगा
- protected है, पर admin नहीं होना जरूरी

### 4.3 Get single product

Endpoint:
- `GET http://localhost:3000/api/products/:id`

Headers:
- `Authorization: Bearer <token>`

- `:id` को product id से बदलो

### 4.4 Update product (admin only)

Endpoint:
- `PUT http://localhost:3000/api/products/:id`

Headers:
- `Authorization: Bearer <admin-token>`

Body example:
```json
{
  "price": 275,
  "description": "Updated description"
}
```

### 4.5 Delete product (admin only)

Endpoint:
- `DELETE http://localhost:3000/api/products/:id`

Headers:
- `Authorization: Bearer <admin-token>`

---

## 5. Stock endpoints

### 5.1 Add stock to product (admin only)

Endpoint:
- `POST http://localhost:3000/api/stock/:productId/add`

Headers:
- `Authorization: Bearer <admin-token>`

Body:
```json
{
  "quantity": 20,
  "notes": "Restocked inventory"
}
```

यह code से होता है:
- product मौजूत है या नहीं चेक करता है
- stock quantity बढ़ाता है
- `STOCK_IN` history record बनाता है

### 5.2 Product stock history

Endpoint:
- `GET http://localhost:3000/api/stock/:productId/history`

Headers:
- `Authorization: Bearer <token>`

- product के stock movement records देता है

### 5.3 All stock history (admin only)

Endpoint:
- `GET http://localhost:3000/api/stock/history`

Headers:
- `Authorization: Bearer <admin-token>`

- यह सभी products के movements दिखाता है

---

## 6. Order endpoints

### 6.1 Place order

Endpoint:
- `POST http://localhost:3000/api/orders`

Headers:
- `Authorization: Bearer <token>`

Body:
```json
{
  "items": [
    { "productId": "PRODUCT_ID_HERE", "quantity": 2 },
    { "productId": "OTHER_PRODUCT_ID", "quantity": 1 }
  ]
}
```

Important:
- productId वही होना चाहिए जो product create करने पर मिला
- quantity positive integer होना चाहिए
- stock कम हो तो `400 Insufficient stock`

### 6.2 Get all orders

Endpoint:
- `GET http://localhost:3000/api/orders`

Headers:
- `Authorization: Bearer <token>`

Behavior:
- normal user → सिर्फ अपने orders
- admin → सभी orders

### 6.3 Get single order

Endpoint:
- `GET http://localhost:3000/api/orders/:id`

Headers:
- `Authorization: Bearer <token>`

Behavior:
- admin किसी भी order देख सकता है
- normal user केवल अपने own order देख सकता है
- नहीं तो `403 Access denied`

### 6.4 Cancel order

Endpoint:
- `POST http://localhost:3000/api/orders/:id/cancel`

Headers:
- `Authorization: Bearer <token>`

Behavior:
- order exist नहीं तो `404`
- अगर already cancelled हो तो `400 Order is already cancelled`
- otherwise:
  - order status को `CANCELLED` बनाता है
  - stock वापस restore करता है
  - `ORDER_CANCELLED` stock movement record बनाता है

---

## 7. Dashboard endpoint

### 7.1 Get dashboard

Endpoint:
- `GET http://localhost:3000/api/dashboard`

Headers:
- `Authorization: Bearer <admin-token>`

यह return करेगा:
- totalProducts
- totalOrders
- pendingOrders
- cancelledOrders
- recentMovements
- lowStockProducts

यह admin-only है, इसलिए normal user से `403` मिलेगा।

---

## 8. Recommended Postman workflow

1. `POST /api/auth/register` — admin user बनाओ
2. `POST /api/auth/login` — token ले लो
3. `POST /api/products` — product बनाओ
4. `POST /api/stock/:productId/add` — stock add करो
5. `GET /api/products` — list देखो
6. `POST /api/orders` — order place करो
7. `GET /api/orders` — orders देखो
8. `GET /api/orders/:id` — single order देखो
9. `POST /api/orders/:id/cancel` — order cancel करो
10. `GET /api/dashboard` — admin summary देखो

---

## 9. Troubleshooting tips

- अगर token नहीं लगा तो `401`
- अगर wrong method use किया (`GET` вместо `POST`) तो Express 404 देगा
- `Authorization` header में format ठीक होना चाहिए:
  - `Bearer eyJ...`

---

## 10. अगर पूरी तरह coverage चाहिए

Postman में `Collections` बनाओ:
- `Auth`
- `Products`
- `Stock`
- `Orders`
- `Dashboard`

और हर request में सिर्फ token बदलो।

---

अगर चाहो तो मैं अब तुम्हारे लिए एक exact Postman request list तैयार कर सकता हूँ, जिसमें हर body और expected response भी होगा।