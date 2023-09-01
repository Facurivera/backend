import express from "express";
import __dirname from './utils.mjs'
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import prodRouter from "./routes/productRouter.mjs";
import cartRouter from "./routes/cartRouter.mjs";
import router from "./routes/viewRoutes.mjs";
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import { Server } from "socket.io";
import ProductManager from "./dao/ProductManager.mjs";
import ChatManager from "./dao/chatManager.mjs";
import mongoose from "mongoose";

const app = express();
const puerto = 8080;
const httpServer = app.listen(puerto, () => {
    console.log('servidor conectado');
});

const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CTM = new ChatManager();

app.engine('handlebars', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products/", prodRouter);
app.use("/api/carts/", cartRouter);
app.use("/", router);

mongoose.connect("mongodb+srv://facurivera:facu1441@cluster0.yh4hxd2.mongodb.net/Ecommerce?retryWrites=true&w=majority");

socketServer.on("connection", (socket) => {
    console.log("Nueva Conexión!");

    const products = PM.getProducts();
    socket.emit("realTimeProducts", products);

    socket.on("nuevoProducto",async (data) => {
        const product = {title:data.title, description:"", code:"", price:data.price, status:"", stock:10, category:"", thumbnails:data.thumbnails};
        PM.addProduct(product);
        const products = await PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("eliminarProducto", (data) => {
        PM.deleteProduct(parseInt(data));
        const products = PM.getProducts();
        socket.emit("realTimeProducts", products);
    });

    socket.on("newMessage", async (data) => {
        CTM.createMessage(data);
        const messages = await CTM.getMessages();
        socket.emit("messages", messages);
    });
});