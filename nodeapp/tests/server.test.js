// ChatBot Controller Tests
const chatBotController = require("../controllers/chatBotController");
const ChatBot = require("../models/ChatBot");

describe("ChatBot Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addChatBot", () => {
    it("should save and return the chatbot with status 200", async () => {
      const chatbotData = {
        botName: "TestBot",
        platform: "Slack",
        intent: "Greet",
        response: "Hello!",
      };
      const req = { body: chatbotData };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      ChatBot.prototype.save = jest.fn().mockResolvedValue(chatbotData);
      await chatBotController.addChatBot(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chatbotData);
    });

    it("should handle error and return status 400", async () => {
      const req = { body: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      ChatBot.prototype.save = jest
        .fn()
        .mockRejectedValue(new Error("Validation error"));
      await chatBotController.addChatBot(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation error" });
    });
  });

  describe("getAllChatBots", () => {
    it("should return all chatbots with status 200", async () => {
      const chatbots = [
        { botName: "Bot1", platform: "Slack", intent: "Greet", response: "Hi" },
        {
          botName: "Bot2",
          platform: "Teams",
          intent: "Help",
          response: "How can I help?",
        },
      ];
      ChatBot.find = jest.fn().mockResolvedValue(chatbots);
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await chatBotController.getAllChatBots(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chatbots);
    });

    it("should handle error and return status 500", async () => {
      ChatBot.find = jest.fn().mockRejectedValue(new Error("DB error"));
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await chatBotController.getAllChatBots(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("getIntegrationByPlatform", () => {
    it("should filter by platform (case-insensitive) and return status 200", async () => {
      const chatbots = [
        { botName: "Bot1", platform: "Slack", intent: "Greet", response: "Hi" },
      ];
      ChatBot.find = jest.fn().mockResolvedValue(chatbots);
      const req = { query: { platform: "slack" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await chatBotController.getIntegrationByPlatform(req, res);
      expect(ChatBot.find).toHaveBeenCalledWith({
        platform: { $regex: /^slack$/i },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chatbots);
    });

    it("should return all if platform is empty and return status 200", async () => {
      const chatbots = [
        { botName: "Bot1", platform: "Slack", intent: "Greet", response: "Hi" },
      ];
      ChatBot.find = jest.fn().mockResolvedValue(chatbots);
      const req = { query: { platform: "" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await chatBotController.getIntegrationByPlatform(req, res);
      expect(ChatBot.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(chatbots);
    });

    it("should handle error and return status 500", async () => {
      ChatBot.find = jest.fn().mockRejectedValue(new Error("DB error"));
      const req = { query: { platform: "Slack" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await chatBotController.getIntegrationByPlatform(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("deleteChatBot", () => {
    it("should delete by id and return status 200", async () => {
      ChatBot.findByIdAndDelete = jest.fn().mockResolvedValue({});
      const req = { params: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
        json: jest.fn(),
      };
      await chatBotController.deleteChatBot(req, res);
      expect(ChatBot.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });

    it("should handle error and return status 500", async () => {
      ChatBot.findByIdAndDelete = jest
        .fn()
        .mockRejectedValue(new Error("DB error"));
      const req = { params: { id: "123" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        end: jest.fn(),
        json: jest.fn(),
      };
      await chatBotController.deleteChatBot(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});
describe("deleteChatBots", () => {
  it("should delete by id and return status 200.", async () => {
    ChatBot.findByIdAndDelete = jest.fn().mockResolvedValue({});
    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
      json: jest.fn(),
    };
    await chatBotController.deleteChatBot(req, res);
    expect(ChatBot.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  it("should handle error and return status 500.", async () => {
    ChatBot.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("DB error"));
    const req = { params: { id: "123" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
      json: jest.fn(),
    };
    await chatBotController.deleteChatBot(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });
});
