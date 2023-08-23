import { productModel } from "./models/product.model.mjs";

class ProductManager {
    async addProduct(product) {
        try {
            if (await this.validateCode(product.code)) {
                console.log("codigo existente");
    
                return false;
            } else {
                await productModel.create(product)
                console.log("Producto agregado");
    
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    async updateProduct(id, product) {
        try {
            if (this.validateId(id)) {   
                if (await this.getProductById(id)) {
                    await productModel.updateOne({_id:id}, product);
                    console.log("Producto actualizado");
        
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.log("No encontrado");
    
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            if (this.validateId(id)) {    
                if (await this.getProductById(id)) {
                    await productModel.deleteOne({_id:id});
                    console.log("Producto eliminado");
    
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.log("No encontrado");
    
            return false;
        }
    }

    async getProducts(limit) {
        return await limit ? productModel.find().limit(limit).lean() : productModel.find().lean();
    }

    async getProductById(id) {
        if (this.validateId(id)) {
            return await productModel.findOne({_id:id}).lean() || null;
        } else {
            console.log("No encontrado");
            
            return null;
        }
    }

    validateId(id) {
        return id.length === 24 ? true : false;
    }

    async validateCode(code) {
        return await productModel.findOne({code:code}) || false;
    }
}

export default ProductManager;