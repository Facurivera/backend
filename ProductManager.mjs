import {promises as fsPromises} from "fs";

class ProductManager{
    constructor(){
        this.path = "Products.json";
        this.products = [];
    }

    addProducts = async (product)=>{
        if (this.validCode(product.code)){
            console.log("error, codigo existente")
        }else{
        const producto = {id:this.getId(), title:product.title, description:product.description, price:product.price, thumbnail:product.thumbnail, code:product.code, stock:product.stock};
        this.products.push(producto);
        await fsPromises.writeFile(this.path, JSON.stringify(this.products));
        console.log("producto añadido con exito!!")
        }
    }

    validCode(code){
        return this.products.some(product => product.code === code);
    }


    getId(){
        let max = 0;
        this.products.forEach(products => {
            max = products.id > max && products.id;
        });
    return (max +1);
    }

    readProducts = async () => {
        let respuesta = await fsPromises.readFile(this.path, "utf-8" );
        return JSON.parse(respuesta);
    };

    getProducts = async () => {
        let respuesta2 = await this.readProducts()
        return console.log(respuesta2)
    }

    getProductsById = async (idProduct)=>{
        let respuesta3 = await this.readProducts();
        let filter = respuesta3.find(product => product.id !== idProduct) || "no encontrado";
        console.log(filter)
    }

    deleteProduct = async (id)=>{
            let respuesta3 = await this.readProducts();
            let filterProd = respuesta3.filter((product) => product.id != id);
            await fsPromises.writeFile(this.path, JSON.stringify(filterProd));
            console.log('Producto eliminado correctamente');
    };
    

    updateProduct = async(id, ...product) =>{
        await this.deleteProduct(id);
        let prodOld = await this.readProducts();
        let prodModif = [{ ...product, id}, ...prodOld];
        await fsPromises.writeFile(this.path, JSON.stringify(prodModif));
    };
};


const PM = new ProductManager();
PM.addProducts({title: "Fernet", description: "Bebida alcohólica", price: 2100, thumbnail: "img1", code: "Fer123", stock: 100})
PM.addProducts({title: "Gancia", description: "Bebida alcohólica", price: 1002, thumbnail: "img2", code: "Gan123", stock: 100})
PM.addProducts({title: "Vino blanco", description: "Bebida alcholica", price: 500, thumbnail:"img3", code: "Vin123", stock: 100})
PM.addProducts({title: "Vino tinto patero", description: "Bebida alcholica", price: 500, thumbnail: "img4", code: "Vin456", stock: 100})
PM.addProducts({title: "Vodka", description: "Bebida alcholica", price: 2210, thumbnail: "img5", code: "Vod123", stock: 100})
PM.addProducts({title: "Ron", description: "Bebida alcholica", price: 5100, thumbnail: "img6", code: "Ron123", stock: 120})
PM.addProducts({title: "Tequila", description: "Bebida alcholica", price: 1700, thumbnail: "img7", code: "Teq123", stock: 102})
PM.addProducts({title: "Cerveza colorada", description: "Bebida alcholica", price: 1000, thumbnail:"img8", code: "Cer123", stock: 120})
PM.addProducts({title: "Cerveza rubia", description: "Bebida alcholica", price: 1000, thumbnail: "img9", code: "Cer456", stock: 102})
PM.addProducts({title: "Cerveza negra", description: "Bebida alcholica", price: 1000, thumbnail: "img10", code: "Cer789", stock: 120})
export default ProductManager