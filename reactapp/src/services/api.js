import axios from 'axios';

const BASE = 'http://localhost:8080/api/chatbots';

export async function addChatBot(chatbot) {
  const res = await axios.post(BASE, chatbot);
  return res.data;
}

export async function getChatBots() {
  const res = await axios.get(BASE);
  return res.data;
}

export async function getIntegrationStatus(platform) {
  const url = `${BASE}/integration` + (platform ? `?platform=${encodeURIComponent(platform)}` : '');
  const res = await axios.get(url);
  return res.data;
}
