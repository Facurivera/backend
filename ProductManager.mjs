import {promises as fsPromises} from "fs";
import { nanoid } from "nanoid";

class ProductManager{
    constructor(){
        this.path = "Products.json";
        this.products = [];
    }

    addProducts = async (product)=>{
        if (this.validCode(product.code)){
            console.log("error, codigo existente")
            return false
        }else{
            let id = nanoid()
        const producto = {id: id, title:product.title, description:product.description, price:product.price,
             status:product.status, thumbnail:product.thumbnail, code:product.code, stock:product.stock, category:product.category};
        this.products.push(producto);
        await this.writeProduct(this.products);
        //console.log("producto añadido con exito!!")
        return true
        }
    }

    writeProduct = async (products) => {
        await fsPromises.writeFile(this.path, JSON.stringify(products))
    }

    validCode(code){
        return this.products.some(product => product.code === code);
    }

    readProducts = async () => {
        let respuesta = await fsPromises.readFile(this.path, "utf-8" );
        return JSON.parse(respuesta);
    };

    getProducts = async () => {
        return await this.readProducts()
    }

    getProductsById = async (id)=>{
        let respuesta3 = await this.readProducts();
        let filter = respuesta3.find(product => product.id !== id) || "no encontrado";
        return filter
    }

    exist = async (id) => {
        let productsAll = await this.readProducts(this.path);
        return productsAll.find((product) => product.id === id);
      };

    deleteProduct = async (id)=>{
            let respuesta3 = await this.readProducts();
            let filterProd = respuesta3.filter((product) => product.id != id);
            await fsPromises.writeFile(this.path, JSON.stringify(filterProd));
        };
    
    updateProduct = async(id, ...product) =>{
        await this.deleteProduct(id);
        let prodOld = await this.readProducts();
        let prodModif = [...prodOld, { ...product, id : id}];
        await fsPromises.writeFile(this.path, JSON.stringify(prodModif));
    };
};


const PM = new ProductManager();

export default ProductManager