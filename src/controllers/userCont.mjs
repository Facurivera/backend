import UserService from "../services/userServ.mjs";
import UserDTO from "../dao/dto/user.dto.mjs";
import UserRespose from "../dao/dto/user.response.dto.mjs";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res) {
    const { first_name, last_name, email, age, password, role } = req.body;
    const response = await this.userService.registerUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });

    return res
      .status(response.status === "success" ? 200 : 400)
      .json(response.user);
  }

  async restorePassword(req, res) {
    const { user, pass } = req.query;
    try {
      const passwordRestored = await this.userService.restorePassword(
        user,
        createHash(pass)
      );
      if (passwordRestored) {
        return res.send({
          status: "OK",
          message: "La contraseña se ha actualizado",
        });
      } else {
        return res.status(401).send({
          status: "Error",
          message: "No se pudo actualizar la contraseña",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
    }
  }

  currentUser(req, res) {
    if (req.session.user) {
      return res.send({
        status: "OK",
        payload: new UserRespose(req.session.user),
      });
    } else {
      return res
        .status(401)
        .send({ status: "Error", message: "No authorized" });
    }
  }
}

export default UserController;