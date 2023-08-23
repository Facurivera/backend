import express from "express";
import ProductManager from "../src/dao/ProductManager.mjs";

const router = express.Router();
const PM = new ProductManager();

router.get("/", async (req, res) => {
    const products = await PM.getProducts();
    res.render("index", {products});
});

router.get("/realtimeproducts", (req, res) =>{
    res.render("realtimeproducts")
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

export default router