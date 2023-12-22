import { Router } from "express";
import {createPayment, handlePaymentSuccess} from "../controllers/paymentCont.mjs";

const paymentsRouter = Router();

paymentsRouter.post("/create-checkout-session", createPayment);

paymentsRouter.get("/payment-success", handlePaymentSuccess);

paymentsRouter.get("/cancel", (req, res) => {});

export default paymentsRouter;