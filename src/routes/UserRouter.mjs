import { Router } from "express";
import UserController from "../controllers/userCont.mjs";
import uploadConfig from "../config/multerConfig.mjs";
import { passportCall, authorization } from "../utils.mjs";

const userController = new UserController();
const usersRouter = Router();

usersRouter.post(
  "/:uid/documents",
  uploadConfig.fields([
    { name: "profiles", maxCount: 1 },
    { name: "products", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  userController.uploadFiles
);

usersRouter.post(
  "/:uid/premium-documents",
  uploadConfig.fields([
    { name: "identificationDocument", maxCount: 1 },
    { name: "domicileProofDocument", maxCount: 1 },
    { name: "accountStatementDocument", maxCount: 1 },
  ]),
  userController.uploadPremiumDocuments
);

usersRouter.post("/premium/:uid", userController.upgradeToPremium);

usersRouter.get("/", userController.getAllUsers);

usersRouter.delete("/inactive", userController.deleteInactiveUsers);

usersRouter.delete(
  "/:uid",
  passportCall("jwt"),
  authorization(["admin"]),
  userController.deleteUser
);

usersRouter.put(
  "/:uid/role",
  passportCall("jwt"),
  authorization(["admin"]),
  userController.changeUserRole
);

export default usersRouter;