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

router.get("/cart", async (req, res) => {
    const cid = req.params.cid;
    const cart = await PM.getCart(cid);
    res.render("products", {products});
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

router.get("/faillogin", async (req, res) => {
    res.send({status:"error", message:"Login inválido"});
});

router.get("/failregister", async (req, res) => {
    res.send({status:"Error", message:"No se pudo registar el Usuario"});
});

export default router