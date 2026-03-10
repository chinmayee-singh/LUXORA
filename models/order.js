const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  products: { type: Array,  required: true },
  total:    { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
