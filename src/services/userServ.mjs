import UserManager from "../dao/UserManager.mjs";
import { ENV_CONFIG } from "../config/config.mjs";
import CartsManager from "../dao/CartManager.mjs"

class UserService {
  constructor() {
    this.userManager = new UserManager();
    this.CartManager = new CartsManager()
  }

  async registerUser({ first_name, last_name, email, age, password, role }) {
    try {

      const cartResponse = await this.CartManager.newCart();
      if (cartResponse.status !== "ok") {
        return { status: "error", message: "Error creating cart" };
      }

      const role = email === ENV_CONFIG.adminEmail && password === ENV_CONFIG.adminPassword
        ? "admin"
        : email === ENV_CONFIG.premiumEmail && password === ENV_CONFIG.premiumPassword
        ? "premium"
        : "user";
        
      const cartId = cartResponse.id;

      const user = await this.userManager.addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        cart: cartId,
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