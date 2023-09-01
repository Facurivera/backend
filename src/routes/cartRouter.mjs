import { Router } from "express";
import CartManager from "../dao/CartManager.mjs";

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

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await CM.updateQuantityProductFromCart(cid, pid, quantity);

    if (result) {
        res.send({status:"ok", message:"Producto actualizado correctamente"});
    } else {
        res.status(400).send({status:"error", message:"No se pudo actualizar el Producto del Carrito"});
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.deleteProductFromCart(cid, pid);

    if (result) {
        res.send({status:"ok", message:"Producto eliminado correctamente"});
    } else {
        res.status(400).send({status:"error", message:"No se pudo eliminar el Producto del Carrito"});
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await CM.deleteProductsFromCart(cid);

    if (result) {
        res.send({status:"ok", message:"Carrito vaciado correctamente"});
    } else {
        res.status(400).send({status:"error", message:"No se pudo vaciar el Carrito"});
    }
});

export default cartsRouter;