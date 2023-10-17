import AuthService from "../services/authServ.mjs";

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    const { email, password } = req.body;
    const userData = await this.authService.login(email, password);
    if (!userData || !userData.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    if (userData && userData.user) {
      req.session.user = {
        id: userData.user.id || userData.user._id, 
        email: userData.user.email,
        first_name: userData.user.firstName || userData.user.first_name, 
        last_name: userData.user.lastName || userData.user.last_name, 
        age: userData.user.age,
        role: userData.user.role
      };
    }

    res.cookie("coderCookieToken", userData.token, {
      httpOnly: true,
      secure: false,
    });

    return res
      .status(200)
      .json({ status: "success", user: userData.user, redirect: "/products" });
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
}

export default AuthController;