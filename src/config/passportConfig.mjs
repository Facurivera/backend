import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { ENV_CONFIG } from "./config.mjs";
import AuthService from "../services/authServ.mjs"

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, emailField:"email"},
        async (req, email, password, done) => {
            const {first_name, last_name, email: reqEmail, age} = req.body;

            try {
                let user = await userModel.findOne({email:reqEmail});

                if (user) {
                    req.logger.info("El usuario " + email + " se encuentra registrado");
                    return done(null, false);
                }

                user = {first_name, last_name, email, age, password:createHash(password)};

                if (user.email == ENV_CONFIG.adminEmail && password === ENV_CONFIG.adminPassword) {
                    req.logger.info("Asignando role de admin");
                    user.role = "admin";
                } else if (user.email == ENV_CONFIG.premiumEmail && password === ENV_CONFIG.premiumPassword) { 
                    req.logger.info("Asignando role de premium");
                    user.role = "premium";
                } else{
                    req.logger.info("Asignando role de usuario");
                    user.role = "user";
                }

                let result = await userModel.create(user);

                if (result) {
                    req.logger.info("Usuario creado exitosamente:", result);
                    return done(null, result);
                }
            } catch (error) {
                req.logger.error("Error durante el proceso de registro:", error);
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
        { emailField: "email", passwordField: "password" },
        async (email, password, done) => { 

        try {
            let user = await userModel.findOne({email:email}).timeout(20000).exec();

            req.logger.info("El usuario " + email + " se encuentra registrado");
            if (!user) {
                return done(null, false, {message: "El usuario es inexistente"});
            }
            if (!isValidPassword(user, password)) {
                console.log("La contraseña es inválida");
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            req.logger.error("La contraseña es inválida");
        }
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: ENV_CONFIG.jwtSecret,
    }, async(jwt_payload, done) => {
        try {
            const user = await userModel.findOne({ email: jwt_payload.email });
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    
    passport.use("github", new GitHubStrategy({
        clientID: ENV_CONFIG.clientIdGithub,
        clientSecret: ENV_CONFIG.clientSecretGithub,
        callbackURL:"https://backendrivera.netlify.app/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const authService = new AuthService();
            console.log("Profile:", JSON.stringify(profile, null, 2));
            const user = await authService.githubCallback(profile);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch(error) {
            return done(error);
        }
    }));
};

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        req.logger.info("Cookies:", req.cookies);
        token = req.cookies["coderCookieToken"]
    }

    return token;
}

export default initializePassport;