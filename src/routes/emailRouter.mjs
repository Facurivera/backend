import express from "express";
import { Router } from "express";
import {sendEmail, sendEmailWithAttachments} from '../controllers/emailCont.mjs';

const emailRouter = Router();

emailRouter.get("/", sendEmail);
emailRouter.get("/attachments", sendEmailWithAttachments);

export default emailRouter;