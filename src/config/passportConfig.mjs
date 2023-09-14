import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
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

                if (user.email == "adminCoder@coder.com") {
                    user.role = "admin";
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

    passport.use("login", new LocalStrategy({passReqToCallback:true,usernameField:"email"}, async (username, password, done) => {
        try {
            let user = await userModel.findOne({email:username});
            console.log(user);

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

    passport.use("github", new GitHubStrategy({
        clientID:"Iv1.c2e462624b9eaf5a",
        clientSecret:"4cc36fb5403d98295a0d0c620104f72933ab2b24",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email});

            if (user) {
                return done(null, user);
            } else {
                let newUser = {
                    first_name:profile._json.name,
                    last_name:"",
                    email:profile._json.email,
                    age:100,
                    password:""
                }

                let result = await userModel.create(newUser);

                return done(null, result);
            }
        } catch(error) {
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
};

export default initializePassport;