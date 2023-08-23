import { messageModel } from "./models/message.model.mjs";

class ChatManager {
    async getMessages() {
        return await messageModel.find().lean();
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }
}

export default ChatManager;