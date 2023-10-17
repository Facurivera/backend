import { Router } from "express";
import CartManager from "../dao/CartManager.mjs";
import { authorization, passportCall } from "../utils.mjs";
import CartController from "../controllers/cartCont.mjs";


const cartsRouter = Router();
const CM = new CartManager();
const cartControllers = new CartController();

cartsRouter.post("/", cartControllers.createCart.bind(cartControllers));

cartsRouter.get("/:cid", cartControllers.getCart.bind(cartControllers));

cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartControllers.addProductToCart.bind(cartControllers));

cartsRouter.put("/:cid/products/:pid", cartControllers.updateQuantityProductFromCart.bind(cartControllers));

cartsRouter.put("/:cid", cartControllers.updateCart.bind(cartControllers));

cartsRouter.delete("/:cid/products/:pid", cartControllers.deleteProductFromCart.bind(cartControllers));

cartsRouter.delete("/:cid", cartControllers.deleteProductsFromCart.bind(cartControllers));

cartsRouter.post("/:cid/purchase", (req, res, next) => {
    next();}, 
    passportCall("jwt"), cartControllers.createPurchaseTicket.bind(cartControllers));
  
export default cartsRouter;