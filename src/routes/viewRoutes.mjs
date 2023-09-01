import express from "express";
import ProductManager from "../dao/ProductManager.mjs";

const router = express.Router();
const PM = new ProductManager();

router.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("index", {products});
});

router.get("/realtimeproducts", (req, res) =>{
    res.render("realtimeproducts")
});

router.get("/chat", (req, res) => {
    res.render("chat");
});

router.get("/products", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.render("products", {products});
});

router.get("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    const product = await PM.getProductById(pid);

    res.render("product", {product});
});

export default router