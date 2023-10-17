import UserManager from "../dao/UserManager.mjs";
import { ADMIN_PASSWORD, ADMIN_EMAIL } from "../config/config.mjs";

class UserService {
  constructor() {
    this.userManager = new UserManager();
  }

  async registerUser({ first_name, last_name, email, age, password, role }) {
    try {
      const user = await this.userManager.addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
      });

      if (user) {
        return { status: "success", user, redirect: "/login" }; 
      } else {
        return { status: "error", message: "usuario existente" };
      }
    } catch (error) {
      return { status: "error", message: "Internal Server Error" };
    }
  }

  async restorePassword(user, hashedPassword) {
    return await this.userManager.restorePassword(user, hashedPassword);
  }
}

export default UserService;