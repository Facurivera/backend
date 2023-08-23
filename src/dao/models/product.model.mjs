import mongoose from "mongoose";

const  productSchema = new mongoose.Schema({
    title: String,
    descripcion: String,
    price: Number,
    thumbnail: Array,
    code: String,
    status: Boolean,
    stock: Number,
    category: String,
});

export const productModel = mongoose.model("products", productSchema);