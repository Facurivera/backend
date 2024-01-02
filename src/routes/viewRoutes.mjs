import express from "express";
import ProductManager from "../dao/ProductManager.mjs";
import CartsManager from "../dao/CartManager.mjs";
import UserManager from "../dao/UserManager.mjs";
import CartControllers from "../controllers/cartCont.mjs"
import { checkAlreadyLoggedIn, checkSession } from "../middlewares/ingreso.mjs";
import { userModel } from "../dao/models/user.model.mjs"
import ticketCont from "../controllers/ticketCont.mjs";

const router = express.Router();
const PM = new ProductManager();
const CM = new CartsManager();
const UM = new UserManager()
const cartControllers = new CartControllers();

async function loadUserCart(req, res, next) {
  if (req.session && req.session.user) {
    const cartId = req.session.user.cart;
    const cartManager = new CartsManager();
    const cart = await cartManager.getCart(cartId);
    req.cart = cart;
  }
  next();
}

router.get("/", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  res.render("index", { products});
});

router.get("/products", checkSession, async (req, res) => {
  const products = await PM.getProducts(req.query);
  const user = req.session.user;
  res.render("products", { products, user });
});

router.get("/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  const product = await PM.getProductById(pid);
  if (product) {
    res.render("productDetail", { product });
  } else {
    res.status(404).send({ status: "error", message: "Product not found." });
  }
});

router.get("/carts", loadUserCart, async (req, res) => {
  const cart = req.cart;

  if (cart) {
    console.log(JSON.stringify(cart, null, 4));
    res.render("cart", { products: cart.products });
  } else {
    res.status(400).send({
      status: "error",
      message: "Error! No se encuentra el ID de Carrito!",
    });
  }
});
  
router.post("/carts/:cid/purchase", async (req, res) => {
  const cid = req.params.cid;
  cartControllers.getPurchase(req, res, cid);
});

router.get("/mostrar-ticket/:ticketId", async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const ticket = await ticketController.getTicketById(ticketId);
    if (ticket) {
      res.render("ticket", { ticket });
    } else {
      res.status(404).send("Ticket no encontrado");
    }
  } catch (error) {
    console.error("Error al mostrar el ticket:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/login", checkAlreadyLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/register", checkAlreadyLoggedIn, (req, res) => {
  res.render("register");
});

router.get("/profile", checkSession, (req, res) => {
  const userData = req.session.user;  
  res.render("profile", { user: userData });
});

router.get("/restore", async (req, res) => {
  res.render("restore");
});

router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.redirect('/restore');
  }
  res.render('reset-password', { token });
});

router.get("/faillogin", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Login failed. Invalid username or password.",
  });
});

router.get("/failregister", async (req, res) => {
  res.send({
    status: "Error",
    message: "Error! No se pudo registar el Usuario!",
  });
});

router.get("/upload/:uid", (req, res) => {
  const userId = req.params.uid;
  console.log("UserID:", userId);
  res.render("uploads", { userId });
});

router.get("/premium/:uid", (req, res) => {
  const userId = req.params.uid;
  console.log("UserID:", userId);
  res.render("premium", { userId });
});

router.get("/adminController", async (req, res) => {
  const users = await userModel.find();
  res.render("adminController", { users });
});
export default router;