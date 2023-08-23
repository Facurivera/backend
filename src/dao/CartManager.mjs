import { cartModel } from "./models/cart.model.mjs";

class CartsManager {
    async newCart() {
      await cartModel.create({products:[]});
      console.log("Cart creado");

      return true;
  }

  async getCart(id) {
      if (this.validateId(id)) {
          return await cartModel.findOne({_id:id}).lean() || null;
      } else {
          console.log("No encontrado");
          
          return null;
      }
  }

  async getCarts() {
      return await cartModel.find().lean();
  }

  async addProductToCart(cid, pid) {
      try {
          if (this.validateId(cid)) {
              const cart = await this.getCart(cid);
              const product = cart.products.find(item => item.product === pid);

              if (product) {
                  product.quantity+= 1;
              } else {
                  cart.products.push({product:pid, quantity:1});
              }

              await cartModel.updateOne({_id:cid}, {products:cart.products});
              console.log("Producto añadido");
  
              return true;
          } else {
              console.log("No encontrado");
              
              return false;
          }
      } catch (error) {
          return false
      }
  }
  
  validateId(id) {
      return id.length === 24 ? true : false;
  }
}

export default CartsManager;