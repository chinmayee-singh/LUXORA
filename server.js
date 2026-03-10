require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

/* IMPORT MODELS */
const User    = require("./models/user");
const Order   = require("./models/order");
const Product = require("./models/product");

/* EXPRESS SETUP */
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), { index: "landing-page.html" }));

/* MONGODB CONNECTION */
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/luxoraDB")
.then(()=> {
  console.log("MongoDB Connected ✅");
  seedProducts(); // auto seed karo agar products nahi hain
})
.catch(err=> console.log("MongoDB Error:", err.message));

/* AUTO SEED SAMPLE PRODUCTS */
async function seedProducts(){
  const count = await Product.countDocuments();
  if(count > 0) return; // already products hain

  const samples = [
    { name:"Elegant Dress",          price:2499, category:"fashion",   image:"Images/dress.webp",       rating:5 },
    { name:"Matte Lipstick",         price:799,  category:"makeup",    image:"Images/lipstick.webp",    rating:4 },
    { name:"Glow Serum",             price:1299, category:"skincare",  image:"Images/serum.jpg",        rating:5 },
    { name:"Luxury Foundation",      price:1199, category:"makeup",    image:"Images/foundation.jpg",   rating:4 },
    { name:"Designer Bag",           price:2999, category:"fashion",   image:"Images/bags.webp",        rating:5 },
    { name:"Stylish Heels",          price:1999, category:"fashion",   image:"Images/heels.webp",       rating:4 },
    { name:"Rose Face Cream",        price:899,  category:"skincare",  image:"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400", rating:5 },
    { name:"Midnight Bloom Perfume", price:2199, category:"fragrance", image:"https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400", rating:5 },
    { name:"Gold Shimmer Palette",   price:1599, category:"makeup",    image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400", rating:4 },
    { name:"Silk Hair Serum",        price:749,  category:"haircare",  image:"https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400", rating:5 },
    { name:"Silk Scarf",             price:1299, category:"fashion",   image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400", rating:4 },
    { name:"Velvet Blush Duo",       price:849,  category:"makeup",    image:"https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", rating:4 },
    { name:"Rose Oud Perfume",       price:3499, category:"fragrance", image:"https://images.unsplash.com/photo-1547887538-047cfbf80b8a?w=400",    rating:5 },
    { name:"Argan Oil Hair Mask",    price:649,  category:"haircare",  image:"https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400", rating:4 },
    { name:"Vitamin C Toner",        price:999,  category:"skincare",  image:"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400",    rating:5 },
  ];

  await Product.insertMany(samples);
  console.log("✅ Sample products seeded!");
}

/* GET ALL PRODUCTS */
app.get("/products", async(req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* SEARCH PRODUCTS */
app.get("/products/search", async(req, res) => {
  try {
    const query = req.query.q || "";
    const products = await Product.find({
      $or: [
        { name:     { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    });
    res.json(products);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* ADD PRODUCT — admin */
app.post("/products", async(req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added ✅", product });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* DELETE PRODUCT — admin */
app.delete("/products/:id", async(req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted ✅" });
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* SIGNUP */
app.post("/signup", async(req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if(existing){
      return res.status(400).json({ message: "Email already registered!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: "Account created successfully!" });
  } catch(err){
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* LOGIN */
app.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "No account found with this email!" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if(!valid){
      return res.status(400).json({ message: "Incorrect password!" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "luxoraSecretKey123", { expiresIn: "7d" });
    res.json({ token, email: user.email });
  } catch(err){
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* STORE ORDER */
app.post("/orders", async(req, res) => {
  try {
    const { userId, products, total } = req.body;
    const order = new Order({ userId, products, total });
    await order.save();
    res.json({ message: "Order stored successfully!" });
  } catch(err){
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

/* GET ALL ORDERS */
app.get("/orders", async(req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
});

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});