import express from "express";
import UserManager from "../dao/UserManager.mjs";
import { createHash } from "../utils.mjs";
import { isValidPassword } from "../utils.mjs";
import passport from "passport";

const sessRouter = express.Router();

sessRouter.post("/login", passport.authenticate("login", {failureRedirect:"/faillogin"}), async (req, res) => {
    if (!req.user) {
        return res.status(401).send({status:"Error", message:"Usuario y Contraseña invalidos"});
    }

    req.session.user = {first_name:req.user.first_name, last_name:req.user.last_name, email:req.user.email, age:req.user.age};
    res.send({status:"OK", message:"Hola, " + userLogged.first_name });
});

sessRouter.post("/register", passport.authenticate("register", {failureRedirect:"/failregister"}), async (req, res) => {
    res.redirect("/login");
});

sessRouter.get("/restore", async (req, res) => {
    let {user, pass} = req.query;
    pass = createHash(pass);
    const passwordRestored = await UM.restorePassword(user, pass);

    if (passwordRestored) {
        res.send({status:"OK", message:"Contraseña actualizada correctamente"});
    } else {
        res.status(401).send({status:"Error", message:"No se pudo actualizar la contraseña"});
    }    
});

sessRouter.get("/github", passport.authenticate("github", {scope:["user:email"]}), async (req, res) => {});

sessRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res) => {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect("/products");
});

export default sessRouter;