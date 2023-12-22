import {fileURLToPath} from "url";
import {dirname} from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import Swal from "sweetalert2";

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
}

export const isValidPassword = (user, password) => {
    try{
        return bcrypt.compareSync(password, user.password);
    }catch (error){
        console.error('error al comparar contraseñas', error)
        return false;
    }
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return error;

            if (!user) {
                return res.status(401).send({error:info.messages ? info.messages : info.toString()})
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({status:"error", message:"no autorizado"});
        }
        if (req.user.role != role) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'rol del usuario no permitido',
              });
            return res.status(403).send({status:"error", message:"No permitido"});
        }
        next();
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;