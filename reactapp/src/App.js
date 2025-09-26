import React, { useEffect, useState } from 'react';
import ChatBotForm from './components/ChatBotForm';
import ChatBotList from './components/ChatBotList';
import { getChatBots, getIntegrationStatus } from './services/api';

export default function App() {
  const [chatbots, setChatbots] = useState([]);
  const [platform, setPlatform] = useState('');

  const fetchChatBots = async () => {
    try {
      const list = await getChatBots();
      setChatbots(list);
    } catch (err) {
      console.error('Failed to fetch chatbots', err);
    }
  };

  const fetchByPlatform = async (plat) => {
    try {
      const list = await getIntegrationStatus(plat);
      setChatbots(list);
    } catch (err) {
      console.error('Failed to fetch integration status', err);
    }
  };

  useEffect(() => {
    fetchChatBots();
  }, []);

  useEffect(() => {
    if (!platform) {
      fetchChatBots();
    } else {
      fetchByPlatform(platform);
    }
  }, [platform]);

  return (
    <div className="container">
      <header>
        <h1>AI ChatBot Integration Platform</h1>
      </header>

      <main>
        <ChatBotForm onAdd={() => { setPlatform(''); fetchChatBots(); }} />

        <section className="controls">
          <label htmlFor="platformSelect">Filter by Platform: </label>
          <select
            id="platformSelect"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="">All</option>
            <option value="Website">Website</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Slack">Slack</option>
            <option value="Telegram">Telegram</option>
          </select>
        </section>

        <ChatBotList chatbots={chatbots} onRefresh={() => fetchChatBots()} />
      </main>
    </div>
  );
}
