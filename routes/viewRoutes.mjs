import express from "express";

const router = express.Router();

const productos = [
    {nombre:"Fernet Branca", precio:2000, img:"https://cdn11.bigcommerce.com/s-abmjjefojj/images/stencil/1280x1280/products/2500/17497/Diapositiva6__81563.1682548583.JPG?c=1"},
    {nombre:"Gancia", precio:1500, img:"https://gobar.vtexassets.com/arquivos/ids/156378/GANICA.jpg?v=636716737494030000"},
    {nombre:"Tequila Camacho", precio:1700, img:"https://www.delmayoristaacasa.com.ar/wp-content/uploads/2023/03/DSC_3147.jpg"},
    {nombre:"Vino Santafilomena", precio:1000, img:"https://d2r9epyceweg5n.cloudfront.net/stores/001/835/724/products/filomena-tinto-11251-0f1dd53cd709b8447116343047520659-480-0.png"},
    {nombre:"Cerveza Andes Rubia", precio:800, img:"https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3100629_f.jpg"},
]

router.get("/", (req, res)=>{
    res.render("index", {productos})
})

router.get("/realtimeproducts", (req, res) =>{
    res.render("realtimeproducts", {productos})
})

/*router.post("/prods", (req, res ) =>{
    
    let {img, nombre, precio} = req.body;
    
    let prod = {img:img, nombre:nombre, precio:precio};
    productos.push(prod);
    res.redirect("/")
})*/

export default router