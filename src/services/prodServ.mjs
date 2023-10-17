import ProductManager from "../dao/ProductManager.mjs";

class ProductService {
  constructor() {
    this.productManager = new ProductManager();
  }

  async addProduct(product) {
    if (await this.productManager.validateCode(product.code)) {
      console.log("Error");
      return null;  
    }

    return await this.productManager.addProduct(product);
  }

  async getProducts(params) {
    return await this.productManager.getProducts(params);
  }

  async getProductById(id) {
    return await this.productManager.getProductById(id);
  }

  async updateProduct(id, product) {
    return await this.productManager.updateProduct(id, product);
  }

  async deleteProduct(id) {
    return await this.productManager.deleteProduct(id);
  }
}

export default ProductService;