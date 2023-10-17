import { productModel } from "./models/product.model.mjs";
import mongoose from "mongoose";

class ProductManager {
    async addProduct(product) {
        try {
          if (await this.validateCode(product.code)) {
            console.log("Error codigo existente");
            return false;
          } else {
            const producto = {
              title: product.title,
              description: product.description,
              code: product.code,
              price: product.price,
              status: product.status,
              stock: product.stock,
              category: product.category,
              thumbnails: product.thumbnails,
            };
            const createdProduct = await productModel.create(producto);
            console.log("producto añadido");
            return createdProduct;
          }
        } catch (error) {
          console.error("Error no se pudo añadir", error);
          return false;
        }
      }

    async updateProduct(id, product) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, product, {
              new: true,
            });
            if (updatedProduct) {
              console.log("Producto actualizado");
              return true;
            } else {
              console.log("Producto no encontrado");
              return false;
            }
        } catch (error) {
            console.log("No encontrado");
    
            return false;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (deletedProduct) {
                console.log('Producto eliminado ', deletedProduct);
                return true;
            } else {
                console.log('Producto no encontrado', id);
                return false;
            }
        } catch (error) {
            console.log("error");
    
            return false;
        }
    }

    async getProducts(params = {}) {
        let { limit = 10, page = 1, query = {}, sort = {} } = params;
        sort = sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : {};

       try {  
        let products = await productModel.paginate(query, {
            limit: limit,
            page: page,
            sort: sort,
            lean: true,
        });
        let status = products ? "success" : "error";
        let prevLink = products.hasPrevPage ? "http://localhost:8000/products?limit=" + limit + "&page=" + products.prevPage : null;
        let nextLink = products.hasNextPage ? "http://localhost:8000/products?limit=" + limit + "&page=" + products.nextPage : null;

        products = {
            status: status,
            payload: products.docs,
            totalPages:products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        };

        return products;
    } catch (error) {
      return {status: "error", payload: [] };
    }
  }

    async getProductById(id) {
        try{
            return await productModel.findById(id).lean();
        } catch (error) {
            console.log("No encontrado");
            return null;
        }
    }

    async validateId(id) {
        try {
            return await productModel.exists({ code: code });
          } catch (error) {
            console.error("Error", error);
            return false;
          }
        }
        async updateProduct(pid, updateData) {
            try {
              const updatedProduct = await productModel.findByIdAndUpdate(pid, updateData, {
                new: true,
              });
              return updatedProduct ? true : false;
            } catch (error) {
              console.error("Error", error);
              return false;
            }
          }  
}

export default ProductManager;