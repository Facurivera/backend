import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const  productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    descripcion: String,
    price: Number,
    thumbnails: Array,
    code: String,
    stock: Number,
    category: String,
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model("products", productSchema);