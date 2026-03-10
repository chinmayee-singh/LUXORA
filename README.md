# 🛍️ LUXORA – Full Stack E-Commerce Website

Luxora is a modern full-stack eCommerce web application designed to simulate a real online shopping platform. Users can browse products, view details, add items to cart, and place orders — all powered by a dynamic backend with REST APIs and MongoDB.

## 🚀 Features

- Product listing with category filtering and search
- Product detail pages with image zoom
- Shopping cart with add/remove/quantity management
- User authentication (Signup & Login with JWT)
- Order placement and checkout flow
- Wishlist (favorites) toggle
- Responsive modern UI
- Auto-seeded sample products on first run
- RESTful API architecture

## 🛠️ Tech Stack

| Layer | Technologies |
|----------|-------------------------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

## 📂 Project Structure

```
LUXORA/
├── public/                  # Frontend static files
│   ├── landing-page.html    # Main product listing page
│   ├── landing-page.css     # Styles
│   ├── landing-page.js      # Frontend logic
│   ├── login.html           # Login / Signup page
│   ├── cart.html             # Shopping cart
│   ├── product.html          # Product detail page
│   ├── checkout.html         # Checkout page
│   ├── order-success.html    # Order confirmation
│   └── *.webp / *.jpg        # Product images
├── models/                  # Mongoose schemas
│   ├── user.js
│   ├── product.js
│   └── order.js
├── server.js                # Express server & API routes
├── package.json
├── .env.example             # Environment variable template
├── Dockerfile               # Docker deployment
└── render.yaml              # Render deployment config
```

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A MongoDB database — either:
  - [MongoDB](https://www.mongodb.com/try/download/community) installed locally, **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster (recommended for deployment)

## 🏠 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chinmayee-singh/LUXORA.git
   cd LUXORA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/luxoraDB
   JWT_SECRET=pick_a_random_secret_string
   ```

   > If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**

   Go to [http://localhost:5000](http://localhost:5000) — the app auto-seeds sample products on first run.

---

## 🚀 Deployment

Below are step-by-step guides for deploying LUXORA. All methods require a **MongoDB Atlas** database (free tier available).

### Set up MongoDB Atlas (required for all deployment methods)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a free shared cluster
3. Under **Database Access**, create a database user with a password
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` in the connection string with your database user's password

Your connection string will look like:
```
mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/luxoraDB?retryWrites=true&w=majority
```

---

### Option 1: Deploy on Render (Recommended — Free Tier)

[Render](https://render.com) is the easiest option. This repo includes a `render.yaml` for one-click setup.

1. Push your code to GitHub (if not already)
2. Go to [dashboard.render.com](https://dashboard.render.com) and sign up / log in
3. Click **New** → **Web Service**
4. Connect your GitHub repo (`chinmayee-singh/LUXORA`)
5. Render auto-detects the settings from `render.yaml`, but verify:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Any random secret string |
   | `NODE_ENV` | `production` |
7. Click **Create Web Service**
8. Wait for the build to finish — your app URL will be `https://luxora-xxxx.onrender.com`

---

### Option 2: Deploy with Docker

This repo includes a `Dockerfile`.

1. **Build the image**
   ```bash
   docker build -t luxora .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 \
     -e MONGODB_URI="mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/luxoraDB" \
     -e JWT_SECRET="pick_a_random_secret" \
     luxora
   ```

3. Open [http://localhost:5000](http://localhost:5000)

> You can deploy this Docker image to any cloud platform that supports containers (AWS ECS, Google Cloud Run, Azure Container Apps, Fly.io, etc.).

---

### Option 3: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **New Project** → **Deploy from GitHub Repo**
3. Select your `LUXORA` repository
4. Railway auto-detects Node.js. Add environment variables:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Any random secret string |
5. Click **Deploy** — Railway assigns a public URL automatically

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `5000`) |
| `MONGODB_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret key for signing JWT tokens |
| `NODE_ENV` | No | Set to `production` in deployment |

See `.env.example` for a template.

## 🌐 Future Improvements

- Payment gateway integration (Stripe / Razorpay)
- Admin dashboard
- Order management system
- Product image uploads
