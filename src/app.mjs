import express from "express";
import prodRouter from "../routes/productRouter.mjs";
import cartRouter from "../routes/cartRouter.mjs";

const app = express();
app.use(express.urlencoded({extended: true}));
const puerto = 8080;

app.use(express.json());
app.use("/api/products/", prodRouter);
app.use("/api/carts/", cartRouter);

const server = app.listen(puerto, () => {
    console.log('servidor conectado');
});
server.on("error", (error) => console.log("error en el server"));