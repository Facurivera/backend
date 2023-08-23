import { Router } from "express";
import CartManager from "../src/dao/CartManager.mjs";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", async (req, res) => {
    const newCart = await CM.newCart();

    if (newCart) {
        res.send({status:"ok", message:"Agregado correctamente"});
    } else {
        res.status(500).send({status:"error", message:"Error"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);

    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error, id invalido"});
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.addProductToCart(cid, pid);

    if (result) {
        res.send({status:"ok", message:"Producto agregado"});
    } else {
        res.status(400).send({status:"error", message:"Error, No se pudo agregar"});
    }
});

export default cartsRouter;