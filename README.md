# ⚡ Standard Electronics - E-Commerce & Admin Dashboard

A full-stack e-commerce application built with the **Next.js 15 App Router**. This project features a modern customer storefront for browsing and purchasing tech products, paired with a powerful Admin Dashboard for inventory management, real-time sales analytics, and order tracking.

## 🔗 Links & Demo

- **🔴 Live Website:** [Visit Standard Electronics](https://standardelectronics.vercel.app)
- **🎥 Video Walkthrough:** [Watch the Demo on YouTube](https://www.youtube.com/watch?v=T-aCuWvhXh0)

## 🚀 Project Overview

**Standard Electronics** bridges the gap between a high-performance frontend and a robust backend.
- **For Customers:** A fast, responsive shopping experience with real-time stock updates.
- **For Admins:** A secure dashboard to visualize revenue trends, manage product catalogs (CRUD), and track order statuses dynamically.

## ✨ Key Features

### 🛍️ Customer Storefront
- **Modern UI/UX:** Responsive design built with Tailwind CSS, featuring a clean hero section and product grid.
- **Server-Side Rendering (SSR):** Products are fetched securely on the server for optimal SEO and performance.
- **Interactive "Buy Now" System:** Client-side interactivity using React Server Actions to handle purchases and stock reduction instantly.
- **Real-Time Stock Checks:** Prevents purchasing of out-of-stock items.

### 🛡️ Admin Dashboard
- **Secure Authentication:** Protected routes using **NextAuth v5** (Credentials Provider).
- **Data Visualization:** Interactive charts powered by **Recharts** and **MongoDB Aggregation Pipelines**:
  - 📈 Revenue Trends (Line Chart)
  - 🏆 Top 5 Best Sellers (Bar Chart)
  - 🥧 Revenue by Category (Pie Chart)
  - 🚦 Order Status Distribution (Donut Chart)
- **Order Management:** Update order status (Pending → Shipped → Delivered) with color-coded indicators.
- **Inventory Management:** Full CRUD capabilities for products.
  - **Image Uploads:** Integrated with **Cloudinary** for image hosting.
  - **Form Validation:** Strict type-checking with **Zod** and **React Hook Form**.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Image Storage:** [Cloudinary](https://cloudinary.com/)
- **Form Handling:** React Hook Form + Zod

## ⚙️ Setup & Installation

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/dhruvkandpal99/NextJs_Ecommerce_Website.git
cd NextJs_Ecommerce_Website
```

### 2. Install Dependencies
```bash
npm install

```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Database Connection
MONGODB_URI=your_mongodb_connection_string

# Authentication (Generate a random string: openssl rand -base64 32)
AUTH_SECRET=your_secret_key

# Admin Credentials (for logging in)
# You can hardcode these in auth.ts or set them up in your DB
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=password123

# Cloudinary (For Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

```

### 4. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

* **Storefront:** `http://localhost:3000/`
* **Admin Login:** `http://localhost:3000/login`

## 📂 Project Structure

```text
├── app/
│   ├── admin/          # Protected Admin routes (Dashboard, Products)
│   ├── api/            # NextAuth API route
│   ├── login/          # Admin Login Page
│   ├── page.tsx        # Customer Landing Page
│   └── layout.tsx      # Root Layout
├── components/         # Reusable UI components (BuyButton, Charts, etc.)
├── lib/
│   ├── actions.ts      # Server Actions (Mutations: Create, Update, Delete)
│   ├── analytics.ts    # Aggregation Logic for Charts
│   ├── db.ts           # Database Connection
│   └── utils.ts        # Helper functions (Sanitization, Class merging)
├── models/             # Mongoose Schemas (Product, Order)
└── public/             # Static assets

```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
