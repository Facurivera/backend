import { Router } from "express";
import { getMockProducts } from "./mockCont.mjs";

const mockingRouter = Router();

mockingRouter.get("/", getMockProducts);

export default mockingRouter;