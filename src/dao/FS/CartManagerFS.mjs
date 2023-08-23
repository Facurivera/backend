import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import ProductManager from "../ProductManager.mjs";

const products = new ProductManager();

class CartsManager {
  constructor() {
    this.path = "../JSONs/carrito.json";
  }
  readCart = async () => {
    let allCart = await fs.readFile(this.path, "utf-8");
    return JSON.parse(allCart);
  };
  writeCart = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart), (error) => {
      if (error) throw error;
    });
  };
  exist = async (id) => {
    let cartsAll = await this.readCart(this.path);
    return cartsAll.find((cart) => cart.id === id);
  };

  addCart = async () => {
    let id = nanoid();
    let cartsOld = await this.readCart();
    let allCarts = [...cartsOld, { id: id, productos: [] }];
    await this.writeCart(allCarts);
  };
  getCartById = async (id) => {
    let cartById = await this.exist(id);
    if (!cartById) return "no existe carrito";
    return cartById;
  };
  addProductInCart = async (cartId, prodId) => {
    let cartById = await this.exist(cartId);
    if (!cartById) return "error carrito no existe";
    let productById = await products.exist(prodId);
    if (!productById) return "error producto no existe";

    let cartsAll = await this.readCart();
    let cartFilter = cartsAll.filter((cart) => cart.id != cartId)
    
    if ( cartById.products.some((prod) => prod.id === prodId)) {
      let moreProducts = cartById.products.find((prod) => prod.id === prodId);
      moreProducts.quantity++;
      console.log(moreProducts.quantity);
      let allCarts = [cartById, ...cartFilter];
      await this.writeCart(allCarts);
    }
    cartById.products.push({ id: productById.id, quantity: 1 });
    let allCarts = [cartById, ...cartFilter];
    await this.writeCart(allCarts);
  };
}

export default CartsManager;