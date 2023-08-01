import { Router } from "express";
import ProductManager from "../ProductManager.mjs";

const prodRouter = Router();
const PM = new ProductManager();

prodRouter.get("/", async (req, res) => {    
    let limit = req.query.limit;
    let allProducts = await PM.getProducts();
    if(!limit) return res.send(await allProducts);
    let productLimit = allProducts.slice(0, limit);
    res.send(await productLimit);
});

prodRouter.get("/:id", async (req, res) => {
    let id = req.params.id;
    let allProducts = await PM.getProducts();
    let ProductsById = allProducts.find(productos => productos.id === id ) || "no existe el producto";
    res.send(await ProductsById);
});

prodRouter.post("/", async (req,res) =>{    
    let newProduct = req.body
    let {title, description, price, code, status, stock, category, thumbnail} = newProduct;
    
    if (!title){
        res.status(400).send({status:"error", message:"no se cargo el campo Title"});
    };
    
    if (!description){
        res.status(400).send({status:"error", message:"no se cargo el campo Description"});
    };
    
    if (!price){
        res.status(400).send({status:"error", message:"no se cargo el campo Price"});
    };
    
    if (!code){
        res.status(400).send({status:"error", message:"no se cargo el campo Code"});
    };
    
    status = !status && true;
    
    if (!stock){
        res.status(400).send({status:"error", message:"no se cargo el campo Stock"});
    };
    
    if (!category){
        res.status(400).send({status:"error", message:"no se cargo el campo Category"});
    };
    
    if (!thumbnail) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)) {
        res.status(400).send({status:"error", message:"Error! Debe ingresar al menos una imagen en el Array Thumbnails!"});
        return false;
    }

    res.send(await PM.addProducts(newProduct))
});

prodRouter.put("/:id", async (req,res) =>{
    let id = req.params.id;
    let updateProduct = req.body;
    let {title, description, price, code, status, stock, category, thumbnail} = updateProduct;
    
    if (!title){
        res.status(400).send({status:"error", message:"no se cargo el campo Title"});
    };
    
    if (!description){
        res.status(400).send({status:"error", message:"no se cargo el campo Description"});
    };
    
    if (!price){
        res.status(400).send({status:"error", message:"no se cargo el campo Price"});
    };
    
    if (!code){
        res.status(400).send({status:"error", message:"no se cargo el campo Code"});
    };
    
    status = !status && true;
    
    if (!stock){
        res.status(400).send({status:"error", message:"no se cargo el campo Stock"});
    };
    
    if (!category){
        res.status(400).send({status:"error", message:"no se cargo el campo Category"});
    };
    
    if (!thumbnail) {
        res.status(400).send({status:"error", message:"Error! No se cargó el campo Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnail)) || (thumbnail.length == 0)) {
        res.status(400).send({status:"error", message:"Error! Debe ingresar al menos una imagen en el Array Thumbnails!"});
        return false;
    }

    res.send(await PM.updateProduct(id, updateProduct))
});

prodRouter.delete("/:id", async (req, res)=> {
    let id = req.params.id
    res.send(await PM.deleteProduct(id))








    /*    let pid = Number(req.params.pid);
    if (PM.deleteProduct(pid)){
        res.send({status:"ok", message:"producto eliminado"});
    }else{
        res.status(500).send({status:"error", message:"error"})
    };*/
})

export default prodRouter;