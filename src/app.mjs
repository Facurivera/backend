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
import passport from "passport";
import session from "express-session";
import sessRouter from "./routes/sessionRoutes.mjs";
import initializePassport from "./config/passportConfig.mjs";
import cookieParser from "cookie-parser";
import { messageModel } from "./dao/models/message.model.mjs";
import MongoStore from "connect-mongo";
import cors from "cors";
import DBManager from "./mongo/ds.mjs"
import { SECRET_KEY_SESSION, PORT } from "./config/config.mjs";
import emailRouter from "./routes/emailRouter.mjs";

const app = express();
const puerto = 8080;
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

const httpServer = app.listen(puerto, () => {
    console.log('servidor conectado');
});
const socketServer = new Server(httpServer);
const PM = new ProductManager();
const CTM = new ChatManager();

app.set("socketServer", socketServer);

app.engine("handlebars",expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"], 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false,  
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_CNX_STR,
      collectionName: "sessions"
    }),
  })
);
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/api/products/", prodRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/sessions/", sessRouter);
app.use("/", router);
app.use('/email', emailRouter)

socketServer.on("connection", async (socket) => {
    console.log("Nueva Conexión!");

    const products = await PM.getProducts();
    socket.emit("initial_products", allProducts.payload);

    const previousMessages = await messageModel.find().sort({ timestamp: 1 });
    socket.emit("previous messages", previousMessages);

    socket.on("message", (data) => {
        console.log("Mensaje recibido del cliente:", data);
      });
    
      socket.on("socket_individual", (data) => {
        console.log("Evento 'socket_individual' recibido:", data);
      });
    
      socket.on("chat message", async (message) => {
        console.log("Received message object:", JSON.stringify(message, null, 2));

        const newMessage = new messageModel({
            user: message.user,
            message: message.text,
            timestamp: new Date(),
          });
          await newMessage.save();
      
          socketServer.emit("chat message", {
            user: message.user,
            message: message.text,
        })    
    })
});
export default socketServer