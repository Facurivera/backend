import { cartModel } from "./models/cart.model.mjs";
import mongoose from "mongoose";
import ProductManager from "./ProductManager.mjs";

class CartsManager {
    constructor() {
      this.productManager = new ProductManager();
    }
    async newCart() {
      let cart = await cartModel.create({ products: [] });
      return {
        status: "ok",
        message: "Carrito creado correctamente",
        id: cart._id,
      };
    }
  
    async getCart(id) {
      if (this.validateId(id)) {
        return (await cartModel.findOne({ _id: id }).lean()) || null;
      } else {
        console.log("No encontrado");
  
        return null;
      }
    }
  
    async getCarts() {
      return await cartModel.find().lean();
    }
  
    async addProductToCart(cid, pid, quantity) {
      try {
  
        if (
          mongoose.Types.ObjectId.isValid(cid) &&
          mongoose.Types.ObjectId.isValid(pid)
        ) {
          const product = await this.productManager.getProductById(pid);
    
          if (!product) {
            console.log("Producto no encontrado");
            return {
              status: "error",
              message: "Producto no encontrado",
            };
          }
  
          if (product.stock < quantity) { 
            return { status: "error", message: "Stock insuficiente" };
        }
  
          const updateResult = await cartModel.updateOne(
            { _id: cid, "products.product": pid },
            { $inc: { "products.$.quantity": 1 } }
          );
  
          if (updateResult.matchedCount === 0) {
            const pushResult = await cartModel.updateOne(
              { _id: cid },
              { $push: { products: { product: pid, quantity: 1 } } }
            );
  
          }
  
          return {
            status: "ok",
            message: "El producto se agregó correctamente",
          };
        } else {
          return {
            status: "error",
            message: "ID inválido",
          };
        }
      } catch (error) {
        console.error(error);
        return {
          status: "error",
          message: "error al agregar el producto al carrito",
        };
      }
    }
  
    async updateQuantityProductFromCart(cid, pid, quantity) {
      try {
        if (this.validateId(cid)) {
          const cart = await this.getCart(cid);
          if (!cart) {
            console.log("carrito no encontrado");
            return false;
          }
  
          console.log("PID:", pid);
          console.log(
            "Cart products:",
            cart.products.map((item) =>
              item.product._id
                ? item.product._id.toString()
                : item.product.toString()
            )
          );
  
          const product = cart.products.find(
            (item) =>
              (item.product._id
                ? item.product._id.toString()
                : item.product.toString()) === pid.toString()
          );
  
          if (product) {
            product.quantity = quantity;
  
            await cartModel.updateOne({ _id: cid }, { products: cart.products });
            console.log("Product updated!");
  
            return true;
          } else {
            console.log("Product not found in cart");
            return false;
          }
        } else {
          console.log("ID invalido");
          return false;
        }
      } catch (error) {
        console.error("Error", error);
        return false;
      }
    }
  
    async updateProducts(cid, products) {
      try {
        await cartModel.updateOne(
          { _id: cid },
          { products: products },
          { new: true, upsert: true }
        );
        console.log("Producto actualizado");
  
        return true;
      } catch (error) {
        console.log("No encontrado");
  
        return false;
      }
    }
  
    async deleteProductFromCart(cid, pid) {
      try {
        if (mongoose.Types.ObjectId.isValid(cid)) {
          const updateResult = await cartModel.updateOne(
            { _id: cid },
            { $pull: { products: { product: pid } } }
          );
  
          if (updateResult.matchedCount > 0) {
            console.log("Producto eliminado");
            return true;
          }
        } else {
          console.log("ID Invalido");
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  
    async deleteProductsFromCart(cid) {
      try {
        if (this.validateId(cid)) {
          const cart = await this.getCart(cid);
  
          await cartModel.updateOne({ _id: cid }, { products: [] });
          console.log("Productos eliminados");
          return true;
        } else {
          console.log("No encontrado");
          return false;
        }
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  
    validateId(id) {
      return mongoose.Types.ObjectId.isValid(id);
    }
  }
  
  export default CartsManager;