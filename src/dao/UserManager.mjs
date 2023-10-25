import { userModel } from "./models/user.model.mjs";
import { createHash, isValidPassword } from "../utils.mjs";


class UserManager {
  async addUser({ first_name, last_name, email, age, password, role }) {
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return null;
      }
      const hashedPassword = createHash(password);
      const user = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role,
      });
      return user;
    } catch (error) {
      throw error;
      }
    }
    async login(user, password) {
      try {
        const userLogged = await userModel.findOne({ password: user });
  
        if (userLogged && isValidPassword(userLogged, password)) {
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