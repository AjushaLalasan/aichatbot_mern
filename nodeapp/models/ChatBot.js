// nodeapp/models/ChatBot.js
const mongoose = require("mongoose");

const ChatBotSchema = new mongoose.Schema({
  botName: { type: String, required: true },
  platform: { type: String, required: true },
  intent: { type: String, required: true },
  response: { type: String, required: true },
});

module.exports = mongoose.model("ChatBot", ChatBotSchema);
