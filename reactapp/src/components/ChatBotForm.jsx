import React, { useState } from 'react';
import { addChatBot } from '../services/api';

export default function ChatBotForm({ onAdd }) {
  const [botName, setBotName] = useState('');
  const [platform, setPlatform] = useState('Website');
  const [intent, setIntent] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setBotName('');
    setPlatform('Website');
    setIntent('');
    setResponse('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { botName, platform, intent, response };
      await addChatBot(payload);
      resetForm();
      if (typeof onAdd === 'function') onAdd();
    } catch (err) {
      console.error('Failed to add chatbot', err);
      alert('Failed to add chatbot. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="chatbot-form" onSubmit={handleSubmit}>
      <h2>Add ChatBot</h2>

      <div className="form-row">
        <label>Bot Name</label>
        <input
          placeholder="Bot Name"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label>Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option>Website</option>
          <option>WhatsApp</option>
          <option>Slack</option>
          <option>Telegram</option>
        </select>
      </div>

      <div className="form-row">
        <label>Intent</label>
        <input
          placeholder="Intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label>Response</label>
        <input
          placeholder="Response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add ChatBot'}</button>
      </div>
    </form>
  );
}
