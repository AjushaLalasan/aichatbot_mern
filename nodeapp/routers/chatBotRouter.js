// nodeapp/routers/chatBotRouter.js
const express = require("express");
const router = express.Router();
const chatBotController = require("../controllers/chatBotController");

// POST /api/chatbots
router.post("/", chatBotController.addChatBot);

// GET /api/chatbots
router.get("/", chatBotController.getAllChatBots);

// GET /api/chatbots/integration?platform=xxx
router.get("/integration", chatBotController.getIntegrationByPlatform);

// DELETE /api/chatbots/:id
router.delete("/:id", chatBotController.deleteChatBot);

module.exports = router;
