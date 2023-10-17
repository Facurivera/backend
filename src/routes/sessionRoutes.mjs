import express from "express";
import { passportCall, authorization, createHash } from "../utils.mjs";
import passport from "passport";
import UserManager from "../dao/UserManager.mjs"
import UserController from "../controllers/userCont.mjs"
import AuthController from "../controllers/authCont.mjs"

const PRIVATE_KEY = "S3CR3T0"

const sessRouter = express.Router();

const UM = new UserManager();
const userController = new UserController();
const authController = new AuthController();

sessRouter.post("/login", (req, res) => authController.login(req, res));

sessRouter.post("/register", userController.register.bind(userController));

sessRouter.get("/restore", userController.restorePassword.bind(userController));

sessRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);

sessRouter.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
    console.log("GitHub Callback Route");
    authController.githubCallback(req, res);
    }
);
sessRouter.post("/logout", (req, res) => authController.logout(req, res));

sessRouter.get("/current", passportCall("jwt"), authorization("user"), (req, res) => {
    console.log(req.cookies); 
    userController.currentUser(req, res);
});
export default sessRouter;