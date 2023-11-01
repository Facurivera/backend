import { Router } from "express";
import { sendSMS } from "../controllers/smsCont.mjs";

const smsRouter = Router();

smsRouter.get("/", sendSMS);

export default smsRouter;