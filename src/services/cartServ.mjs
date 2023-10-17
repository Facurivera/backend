import CartsManager from "../dao/CartManager.mjs";

class CartService {
  constructor() {
    this.cartsManager = new CartsManager();
  }

  async createCart() {
    return await this.cartsManager.newCart();
  }

  async getCart(id) {
    return await this.cartsManager.getCart(id);
  }

  async addProductToCart(cid, pid) {
    const result = await this.cartsManager.addProductToCart(cid, pid);
    if (result) {
      return { status: "ok", message: "El producto se agregó" };
    } else {
      throw new Error("No se pudo agregar el Producto al Carrito");
    }
  }

  async updateQuantityProductFromCart(cartId, productId, quantity) {
    const result = await this.cartsManager.updateQuantityProductFromCart(
      cartId,
      productId,
      quantity
    );
    if (result) {
      return {
        status: "ok",
        message: "El producto se actualizó ",
      };
    } else {
      throw new Error("No se pudo actualizar el producto del carrito");
    }
  }

  async deleteProductFromCart(cartId, productId) {
    const result = await this.cartsManager.deleteProductFromCart(
      cartId,
      productId
    );
    if (result) {
      return { status: "ok", message: "El producto se eliminó " };
    } else {
      throw new Error("No se pudo eliminar el producto del carrito");
    }
  }

  async deleteCart(cartId) {
    const result = await this.cartsManager.deleteProductFromCart(cid, pid);
    if (result) {
      res.send({
        status: "ok",
        message: "El producto se eliminó",
      });
    } else {
      res.status(400).send({
        status: "error",
        message: "No se pudo eliminar el producto del carrito",
      });
    }
    return await this.cartsManager.deleteProductFromCart(cid, pid);
  }

  async updateCart(cartId, products) {
    const result = await this.cartsManager.updateProducts(cartId, products);
    if (result) {
      return { status: "ok", message: "El carrito se actualizó" };
    } else {
      throw new Error("No se pudo actualizar el carrito");
    }
  }

  async deleteProductsFromCart(cartId) {
    const result = await this.cartsManager.deleteProductsFromCart(cartId);
    if (result) {
      return { status: "ok", message: "El carrito se vació" };
    } else {
      throw new Error('No se pudo vaciar el Carrito');
    }
  }
}

export default CartService;