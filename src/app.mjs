import express from "express";
import prodRouter from "../routes/productRouter.mjs";
import cartRouter from "../routes/cartRouter.mjs";
import { engine } from "express-handlebars";
import {__dirname} from './utils.mjs'
import * as path from "path"
import router from "../routes/viewRoutes.mjs";
import { Server } from "socket.io";


const app = express();
app.use(express.urlencoded({extended: true}));
const puerto = 8080;

const httpServer = app.listen(puerto, () => {
    console.log('servidor conectado');
});
httpServer.on("error", (error) => console.log("error en el server"));

const socketServer = new Server(httpServer);


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.resolve(__dirname + "/views"));
app.use('/', express.static(__dirname + "/public"));
app.use(express.json());
app.use("/", router);

socketServer.on('connect', () =>{
    console.log("nueva conexion")
})


//app.use("/", prodRouter);
//app.use("/api/carts/", cartRouter);
