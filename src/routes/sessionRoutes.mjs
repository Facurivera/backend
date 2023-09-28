import express from "express";
import { createHash } from "../utils.mjs";
import { isValidPassword } from "../utils.mjs";
import { passportCall, authorization } from "../utils.mjs";
import passport from "passport";
import  jwt from "jsonwebtoken"
import { userModel } from "../dao/models/user.model.mjs";

const PRIVATE_KEY = "S3CR3T0"

const sessRouter = express.Router();

sessRouter.post("/login", async (req, res) => {
    const {email, pass} = req.body;
    let user = await userModel.findOne({email:email});
    if (!user) {
        return res.status(401).send({status:"Error", message:"Usuario y Contraseña invalidos"});
    }
    let token = jwt.sign({email:email, password:pass, role:user.role}, PRIVATE_KEY, {expiresIn:"24h"});
    res.cookie("coderCookieToken", token, {maxAge:3600*1000, httpOnly:true});
    return res.redirect("/products");
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

sessRouter.get("/logout", async (req, res) => {
    req.session.destroy;
    res.redirect("/");
});

sessRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    res.send({status:"OK", payload:req.user});
});

export default sessRouter;