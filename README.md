# Nexa Inventory

A modern full-stack inventory management system built with **Next.js**, **Express.js**, **Prisma ORM**, and **MySQL**. The application provides an intuitive interface for managing products, stock movements, customer orders, and inventory analytics while maintaining accurate stock levels through transactional database operations.

---

## Overview

Nexa Inventory is designed to simplify inventory management by allowing users to:

* Manage products
* Track stock movements
* Place and cancel orders
* Monitor inventory health
* View dashboard analytics
* Maintain complete stock history

The backend ensures inventory consistency using database transactions, while the frontend provides a clean and responsive interface built with modern React technologies.

---

## Features

### Product Management

* Create products
* Edit existing products
* Delete products
* SKU uniqueness validation
* Product search
* Product details page

### Inventory Management

* Add stock
* Decrease stock
* Live stock quantities
* Automatic stock history
* Manual stock adjustment notes

### Order Management

* Create orders
* Multi-item order support
* Automatic stock deduction
* Order cancellation
* Automatic stock restoration
* Order history

### Dashboard

* Total products
* Total inventory
* Pending orders
* Low stock products
* Recent stock movements
* Inventory summary cards

### Authentication

* JWT Authentication
* Login
* Registration
* Protected routes
* Persistent sessions

### User Experience

* Responsive design
* Dark mode
* Toast notifications
* Loading states
* Error handling
* Search functionality

---

# Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Zustand
* Axios
* Sonner
* Lucide Icons

## Backend

* Express.js
* TypeScript
* Prisma ORM
* JWT
* bcrypt
* Express Middleware

## Database

* MySQL
* Aiven Cloud Database

## Deployment

Frontend

* Vercel

Backend

* Render

Database

* Aiven MySQL

---

# Folder Structure

```
Nexa-Inventory
│
├── frontend
│   ├── app
│   ├── components
│   ├── lib
│   ├── store
│   ├── hooks
│   └── public
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── routes
│   │   ├── middleware
│   │   ├── utils
│   │   └── generated
│   │
│   └── prisma
│
└── README.md
```

---

# Core Modules

## Authentication

* Register
* Login
* JWT generation
* Protected APIs
* Session persistence

---

## Products

Supports

* Create
* Read
* Update
* Delete

Validation

* Required fields
* Unique SKU
* Positive price validation

---

## Stock

Supports

* Stock increase
* Stock decrease
* Manual notes
* Movement history

Every stock change automatically creates a Stock Movement record.

---

## Orders

Supports

* Create order
* Cancel order
* Automatic inventory deduction
* Automatic inventory restoration

Stock consistency is maintained using Prisma Transactions.

---

## Dashboard

Displays

* Total Products
* Total Stock
* Pending Orders
* Low Stock Products
* Recent Stock Movements

---

# Database Design

Main tables

* Users
* Products
* Orders
* OrderItems
* StockMovements

Relationships

```
User
 └── Orders

Order
 └── OrderItems

Product
 ├── OrderItems
 └── StockMovements
```

---

# API Overview

Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Products

```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Stock

```
POST /api/stock/:productId/add
POST /api/stock/:productId/adjust
GET  /api/stock/history
GET  /api/stock/:productId/history
```

Orders

```
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
POST /api/orders/:id/cancel
```

Dashboard

```
GET /api/dashboard
```

---

# Validation

The application prevents:

* Duplicate SKU creation
* Negative product prices
* Negative stock addition
* Stock below zero
* Empty required fields
* Ordering unavailable stock
* Cancelling an already cancelled order
* Invalid JWT access
* Invalid product IDs
* Invalid order IDs

---

# Error Handling

Frontend

* Toast notifications
* Loading indicators
* Friendly validation messages

Backend

* Proper HTTP status codes
* Centralized error responses
* Transaction rollback
* API validation

---

# Security

* Password hashing using bcrypt
* JWT Authentication
* Protected API routes
* Environment variables
* Prisma parameterized queries
* SQL Injection protection
* Input validation

---

# Deployment

Frontend

* Vercel

Backend

* Render

Database

* Aiven MySQL

---

# Future Improvements

Potential enhancements include:

* Role-based access control
* Categories
* Suppliers
* Purchase orders
* Barcode support
* CSV import/export
* Sales reports
* Email notifications
* Image uploads
* Advanced analytics
* Pagination
* Audit logs
* Unit testing
* Docker support
* CI/CD pipelines

---

# Highlights

This project demonstrates:

* Full-stack application development
* REST API design
* Database modeling
* Prisma ORM
* Authentication
* Transaction handling
* Inventory consistency
* Responsive UI
* TypeScript
* Modern React patterns
* Clean project structure

---

# Author

**Deepak Varshney**

GitHub:
https://github.com/Deepak-Varshney

---

# License

This project is developed for educational and assessment purposes.
