import { cartModel } from "./models/cart.model.mjs";

class CartsManager {
    async newCart() {
      console.log("Cart creado");
      return await cartModel.create({products:[]});;
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

            return false
            }
        }catch(error){
            return false
        }
    }

    async updateProducts(cid, products) {
        try {
            if (this.validateId(cid)) {
                await cartModel.findOneAndUpdate({_id:cid}, {products:products}, {new:true, upsert:true});
            console.log("Producto actualizado");
    
                return true;
            } else {
                console.log("No encontrado");
                
                return false;
            }
        }catch (error){
            return false
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                const product = cart.products.find(item => item.product === pid);
                product.quantity = quantity;

                await cartModel.updateOne({_id:cid}, {products:cart.products});
                console.log("Producto actualizado");

                return true;
            } else {
                console.log("No encontrado");

                return false
            }
        }catch (error){
            return false
        }
    }

    async deleteProduct(cid, pid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);
                const products = cart.products.filter(item => item.product !== pid);

                await cartModel.updateOne({_id:cid}, {products:products});
                console.log("Producto eliminado");

                return true;
            } else {
                console.log("No encontrado");

                return false
            }
        } catch (error) {
            return false
        }
    }

    async deleteProducts(cid) {
        try {
            if (this.validateId(cid)) {
                const cart = await this.getCart(cid);

                await cartModel.updateOne({_id:cid}, {products:[]});
                console.log("Productos eliminados");

                    return true;
            } else {
                console.log("No encontrados");

                return false
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