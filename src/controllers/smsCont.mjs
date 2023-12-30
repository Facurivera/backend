import twilio from "twilio";
import { ENV_CONFIG } from "../config/config.mjs";

const twilioClient = twilio(
  ENV_CONFIG.twilioAccountSid,
  ENV_CONFIG.twilioAuthToken
);
const twilioSMSOptions = {
  body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
  from: ENV_CONFIG.twilioNumber,
  to: "+54 358 506 9301",
};

export const sendSMS = async (req, res) => {
  try {
    const result = await twilioClient.messages.create(twilioSMSOptions);
    res.send({ message: "Success!", payload: result });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).send({ error: error.message });
  }
  
};