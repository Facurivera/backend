import ProductManager from "../ProductManager.mjs";
import express from "express";

const app = express();
app.use(express.urlencoded({extended: true}));

const productos = new ProductManager();
const readProducts = productos.readProducts();

app.get("/products", async (req, res) => {
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await readProducts);
    let allProducts = await readProducts;
    let productLimit = allProducts.slice(0, limit);
    res.send(productLimit);
});

app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    let allProducts = await readProducts;
    let ProductsById = allProducts.find(productos => productos.id === id ) || "no existe el producto";
    res.send(ProductsById);
});

const puerto = 8080;
const server = app.listen(puerto, () => {
    console.log('servidor conectado');
});
server.on("error", (error) => console.log("error en el server"))