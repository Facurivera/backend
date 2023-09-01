import { Router } from "express";
import ProductManager from "../dao/ProductManager.mjs";

const prodRouter = Router();
const PM = new ProductManager();

prodRouter.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);
    res.send({products});
});

prodRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await PM.getProductById(pid);
    
    res.send({products});
});

prodRouter.post("/", async (req,res) =>{    
    let {title, description, price, code, status, stock, category, thumbnails} = req.body;
    
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
    
    if (!thumbnails) {
        res.status(400).send({status:"error", message:"no se cargó el campo Thumbnails"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"debe ingresar al menos una imagen en el Array Thumbnails"});
        return false;
    };

    const result = await PM.addProduct({title, description, code, price, status, stock, category, thumbnails}); 

    if (result) {
        res.send({status:"ok", message:"Producto agregado correctamente"});
    } else {
        res.status(500).send({status:"error", message:"No se pudo agregar el Producto"});
    }
});

prodRouter.put("/:pid", async (req,res) =>{
    let pid = req.params.pid;
    let {title, description, price, code, status, stock, category, thumbnails} = req.body;
    
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
    
    if (!thumbnails) {
        res.status(400).send({status:"error", message:"no se cargó el campo Thumbnails"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"debe ingresar al menos una imagen en el Array Thumbnails"});
        return false;
    }

    const result = await PM.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnails});

    if (result) {
        res.send({status:"ok", message:"Producto actualizado correctamente"});
    } else {
        res.status(500).send({status:"error", message:"No se pudo actualizar el Producto"});
    }
});

prodRouter.delete("/:pid", async (req, res)=> {
    let pid = req.params.pid
    const result = await PM.deleteProduct(pid)

    if (result) {
        res.send({status:"ok", message:"Producto eliminado correctamente"});
    } else {
        res.status(500).send({status:"error", message:"No se pudo eliminar el Producto"});
    }
});

export default prodRouter;