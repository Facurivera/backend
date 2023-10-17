import TicketService from "../services/ticketServ.mjs"

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  async createTicket(req) {
    try {
        const data = req.body;
        const ticket = await this.ticketService.createTicket(data);

        if (ticket) {
            return ticket;  
        } else {
            throw new Error("Error al crear el ticket");
        }
    } catch (error) {
        throw error;  
    }
}

}

export default new TicketController();