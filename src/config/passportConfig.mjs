import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    
    passport.use("register", new LocalStrategy(
        {passReqToCallback:true, usernameField:"email"},
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;

            try {
                let user = await userModel.findOne({email:username});

                if (user) {
                    console.log("El usuario " + email + " se encuentra registrado");
                    return done(null, false);
                }

                user = {first_name, last_name, email, age, password:createHash(password)};

                if (user.email == process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
                    user.role = "admin";
                } else{
                    user.role = "user";
                }

                let result = await userModel.create(user);

                if (result) {
                    return done(null, result);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("login", new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        async (username, password, done) => { 

        try {
            let user = await userModel.findOne({email:username});
            if (!user) {
                console.log("El usuario es inexistente");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                console.log("La contraseña es inválida");
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
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
        secretOrKey:process.env.JWT_SECRET,
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
        clientID: process.env.CLIENT_ID_GITHUB,
        clientSecret: process.env.CLIENT_SECRET_GITHUB,
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
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
        token = req.cookies["coderCookieToken"]
    }

    return token;
}

export default initializePassport;