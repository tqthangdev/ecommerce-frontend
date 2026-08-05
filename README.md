# E-Commerce Frontend

Frontend application for an E-Commerce platform built with **Next.js 16**, **React**, and **TypeScript**.

## Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **HTTP Client:** Axios
* **Authentication:** JWT Access Token + HttpOnly Refresh Token Cookie
* **UI Icons:** Lucide React

## Features

### Customer

* Product listing with:

  * Search
  * Filtering
  * Sorting
  * Pagination
* Product detail page
* Product variant selection
* Shopping cart
* Checkout process
* Address management
* Order history
* Order detail view
* Authentication:

  * Register
  * Login
  * Logout
  * Token refresh handling

### Admin

* Dashboard
* Product management
* Category management
* Brand management
* Order management
* Order status updates

## Project Structure

```
app/
├── (shop)/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── orders/
│
├── admin/
│   ├── products/
│   ├── categories/
│   ├── brands/
│   └── orders/

components/
├── product/
├── cart/
├── checkout/
└── ui/

services/
├── auth.service.ts
├── product.service.ts
├── order.service.ts
└── address.service.ts

stores/
└── Zustand stores

lib/
├── api.ts
└── request.ts
```

## Getting Started

### Requirements

* Node.js 20+
* Backend API running

### Installation

Install dependencies:

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Update the API URL depending on your backend environment.

### Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## Authentication Flow

The application uses:

* Access Token stored in memory (Zustand)
* Refresh Token stored in HttpOnly Cookie
* Automatic access token refresh when expired
* Protected admin routes

## Build for Production

Create production build:

```bash
npm run build
```

Run production server:

```bash
npm start
```

## Deployment

This project can be deployed on platforms supporting Next.js applications such as Vercel.

Before deployment:

* Configure environment variables
* Ensure backend API is publicly accessible
* Update `NEXT_PUBLIC_API_URL`

## Related Backend

Backend repository:

* Spring Boot E-Commerce API
* Java 21
* Spring Boot
* MySQL
* Flyway Migration
* JWT Authentication

## License

This project is for learning and portfolio purposes.
