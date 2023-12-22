import { ticketModel } from "../dao/models/ticket.model.mjs";

class TicketService {
  async createTicket(data) {

    if (
      !data.code ||
      !data.purchase_datetime ||
      !data.amount ||
      !data.purchaser
    ) {
      throw new Error("Datos incompletos para crear el ticket.");
    }

    const ticket = new ticketModel(data);
    await ticket.save();
    console.log("Ticket creado:", ticket);
    return ticket;
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId);

      if (!ticket) {
        console.error("Ticket no encontrado con ID:", ticketId);
        return null;
      }

      return ticket;
    } catch (error) {
      console.error("Error al buscar el ticket por ID:", error);
      throw error;
    }
  }
}


export default TicketService;