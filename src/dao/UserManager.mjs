import { userModel } from "./models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";
import UserDTO from "./dto/user.dto.mjs";


class UserManager {
    async addUser({ first_name, last_name, email, age, password, role }) {
      try {
        const existingUser = await userModel.findOne({ email });
    
        if (existingUser) {
          console.log("usuario existente");
          return null;
        }
    
        const hashedPassword = createHash(password);
        const user = await userModel.create({
          first_name,
          last_name,
          email,
          age,
          password: hashedPassword,
          role  
        });
    
        console.log("ususario añadido", user);
        return new UserDTO(user); 
      } catch (error) {
        console.error("Error", error);
        throw error;
      }
    }
    async login(user, pass) {
      try {
        const userLogged = await userModel.findOne({ email: user });
  
        if (userLogged && isValidPassword(userLogged, pass)) {
          return new UserDTO(userLogged); 
      }
        return null;
      } catch (error) {
        console.error("Error", error);
        throw error;
      }
    }
  
    async restorePassword(email, hashedPassword) {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          console.log("Usuario no encontrado");
          return false;
        }
  
        user.password = hashedPassword;
  
        await user.save();
  
        console.log("Contraseña restaurada correctamente.");
        return true;
      } catch (error) {
        console.error("Error", error);
        return false;
      }
    }
  }
  export default UserManager;