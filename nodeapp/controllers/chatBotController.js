// nodeapp/controllers/chatBotController.js
const ChatBot = require("../models/ChatBot");

exports.addChatBot = async (req, res) => {
  try {
    const chatbot = new ChatBot(req.body);
    const saved = await chatbot.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllChatBots = async (req, res) => {
  try {
    const list = await ChatBot.find();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIntegrationByPlatform = async (req, res) => {
  try {
    const { platform } = req.query;
    let list;
    if (!platform || platform.trim() === "") {
      list = await ChatBot.find();
    } else {
      list = await ChatBot.find({
        platform: { $regex: new RegExp("^" + platform + "$", "i") },
      });
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteChatBot = async (req, res) => {
  try {
    await ChatBot.findByIdAndDelete(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
