import { Router } from "express";
import CartManager from "../Managers/CartManager.mjs";

const cartRouter = Router();
const CM = new CartManager();

cartRouter.post("/", async (req, res) => {
    res.send(await CM.addCart())
})

cartRouter.get("/", async (req, res) =>{
    res.send(await CM.readCart())
})

cartRouter.get("/:id", async (req, res) =>{
    res.send(await CM.getCartById(req.params.id))
})

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    let cartId = req.params .cid;
    let prodId = req.params.pid;
    res.send(await CM.addProductInCart(cartId, prodId));
})
export default cartRouter