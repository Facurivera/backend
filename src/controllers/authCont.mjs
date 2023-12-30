import AuthService from "../services/authServ.mjs";
import CustomError from "../services/errors/CustomError.mjs";
import EErrors from "../services/errors/errors-enum.mjs";
import { generateAuthenticationErrorInfo } from "../services/errors/messages/user-auth-error.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import sendResetPasswordEmail from "./reserPassCont.mjs"

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try{
      const { email, password } = req.body;
      const userData = await this.authService.login(email, password);
      req.logger.info("User data retrieved:", userData);
      
      if (userData && userData.user) {
        userData.user.last_connection = new Date();
        await userData.user.save();
      } else {
        console.error("userData o userData.user es null o undefined");
      }
      
      if (!userData || !userData.user) {
        req.logger.error("Invalid credentials");
          const customError = new CustomError({
            name: "Authentication Error",
            message: "Invalid credentials",
            code: 401,
            cause: generateAuthenticationErrorInfo(email), 
          });
          return next(customError);
        }

      if (userData && userData.user) {
        req.session.user = {
          id: userData.user.id || userData.user._id,
          email: userData.user.email,
          first_name: userData.user.firstName || userData.user.first_name,
          last_name: userData.user.lastName || userData.user.last_name,
          age: userData.user.age,
          role: userData.user.role,
          cart: userData.user.cart 
        };
      }
      
      req.logger.info("Full user data object:", userData.user);

      res.cookie("coderCookieToken", userData.token, {
        httpOnly: true,
        secure: false,
      });

      return res
        .status(200)
        .json({ status: "success", user: userData.user, redirect: "/products" 
      });
      
  } catch (error) {
    return next(error)
  }
}

  async githubCallback(req, res) {
    try {
      if (req.user) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        return res.redirect("/products");
      } else {
        return res.redirect("/login");
      }
    } catch (error) {
      return res.redirect("/login");
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/profile");
      }
      return res.redirect("/login");
    });
  }

  async restorePassword(req, res) {
    const { email } = req.body;
    try {
      await sendResetPasswordEmail(email);
      res.send("Se ha enviado un enlace a tu correo electrónico para restablecer su contraseña");
    } catch (error) {
      res
        .status(500)
        .send(
          "Hubo un error al procesar tu solicitud" + error.message);
    }
  }

  async resetPassword(req, res) {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send("Las contraseñas no coinciden.");
    }

    try {
      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          message:
            "El token de restablecimiento de contraseña es inválido o ha expirado.",
          tokenExpired: true,
        });
      }

      const isSamePassword = isValidPassword(user, password);

      if (isSamePassword) {
        return res
          .status(400)
          .send(
            "La nueva contraseña debe ser diferente"
          );
      }

      user.password = createHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      res.send("Tu contraseña ha sido actualizada");
    } catch (error) {
      console.error("Error al resetear la contraseña:", error);
      res
        .status(500)
        .send(
          "Error al intentar actualizar la contraseña."
        );
    }
  }
}


export default AuthController;