import { Router } from "express";
import CartManager from "../dao/CartManager.mjs";
import { authorization, passportCall } from "../utils.mjs";
import CartController from "../controllers/cartCont.mjs";
import { userModel } from "../dao/models/user.model.mjs";
import Stripe from "stripe";

const cartsRouter = Router();
const CM = new CartManager();
const cartControllers = new CartController();
const stripe = new Stripe("sk_test_51OPr90IX8JoJOR4pnDULtQAnLpP7gJAAQVj21F4aP7W1DS2rCgwvW7wNpG4okAmTegR9TJ9hcjQemBSzn0DIBQht006Kc3brH6");

cartsRouter.post("/", cartControllers.createCart.bind(cartControllers));

cartsRouter.get("/:cid", cartControllers.getCart.bind(cartControllers));

cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['user']), cartControllers.addProductToCart.bind(cartControllers));

cartsRouter.put("/:cid/products/:pid", cartControllers.updateQuantityProductFromCart.bind(cartControllers));

cartsRouter.put("/:cid", cartControllers.updateCart.bind(cartControllers));

cartsRouter.delete("/:cid/products/:pid", cartControllers.deleteProductFromCart.bind(cartControllers));

cartsRouter.delete("/:cid", cartControllers.deleteProductsFromCart.bind(cartControllers));

cartsRouter.post("/:cid/purchase", (req, res, next) => { next();}, 
    passportCall("jwt"), cartControllers.createPurchaseTicket.bind(cartControllers));

cartsRouter.get("/usuario/carrito", passportCall("jwt"), authorization(["user"]),
    async (req, res) => {
        try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);
    
        if (!user || !user.cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
    
        return res.json({ id: user.cart });
        } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    );
  
export default cartsRouter;