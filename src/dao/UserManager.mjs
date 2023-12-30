import { userModel } from "./models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import UserDTO from "./dto/user.dto.mjs";

class UserManager {
  async addUser({ first_name, last_name, email, age, password, role, cart}) {
    try {
      console.log("Antes de buscar usuario existente en la base de datos");
      const existingUser = await userModel.findOne({ email });
      console.log("Después de buscar usuario existente en la base de datos", existingUser);
            
      if (existingUser) {
        return { status: "user_exists", message: "El usuario ya existe" };
      }
      const hashedPassword = await createHash(password);
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role,
        cart
      });
      return user;
    } catch (error) {
      console.error("Error durante el registro del usuario:", error);
      throw error;
      }
    }
    async login(user, pass) {
      try {
        const userLogged = await userModel.findOne({ email: user });
  
        if (userLogged && isValidPassword(userLogged, pass)) {
          const role = userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";
          return userLogged;
        }
        return null;
      } catch (error) {
        throw error;
      }
    }
    async restorePassword(email, hashedPassword) {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          return false;
        }
        user.password = hashedPassword;
        await user.save();
        return true;
      } catch (error) {
        return false;
      }
    }
  }
  export default UserManager;