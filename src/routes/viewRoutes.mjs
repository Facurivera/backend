import express from "express";
import ProductManager from "../dao/ProductManager.mjs";
import CartsManager from "../dao/CartManager.mjs";

const router = express.Router();
const PM = new ProductManager();
const CM = new CartsManager();


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

router.get("/carts/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.render("cart", {products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"No se encuentra el ID de Carrito"});
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/profile", (req, res) => {
    res.render("profile");
});

router.get("/restore", async (req, res) => {
    res.render("restore");
})

export default router