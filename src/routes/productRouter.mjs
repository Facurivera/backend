import { Router } from "express";
import ProductManager from "../dao/ProductManager.mjs";
import { authorization, passportCall } from "../utils.mjs";
import ProductService from "../services/prodServ.mjs"
import ProductController from "../controllers/prodCont.mjs"

const prodRouter = Router();
const PM = new ProductManager();
const productController = new ProductController()
const productService = new ProductService();

prodRouter.get("/", productController.getProducts.bind(productController));
prodRouter.get(
  "/:pid",
  productController.getProductById.bind(productController)
);
prodRouter.post('/', passportCall('jwt'), authorization(['admin']), productController.addProduct.bind(productController));
prodRouter.put('/:pid',passportCall('jwt'), authorization(['admin']), productController.updateProduct.bind(productController));
prodRouter.delete('/:pid',passportCall('jwt'), authorization(['admin']), productController.deleteProduct.bind(productController));


export default prodRouter;