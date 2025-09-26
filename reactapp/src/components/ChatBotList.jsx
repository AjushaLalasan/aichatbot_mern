import React from "react";
import axios from "axios";

export default function ChatBotList({ chatbots = [], onRefresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this chatbot?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/chatbots/${id}`);
      if (typeof onRefresh === "function") onRefresh();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete. See console for details.");
    }
  };

  return (
    <div className="chatbot-list">
      <h2>ChatBots</h2>
      <table>
        <thead>
          <tr>
            <th>Bot Name</th>
            <th>Platform</th>
            <th>Intent</th>
            <th>Response</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chatbots.length === 0 && (
            <tr>
              <td colSpan="5">No chatbots found.</td>
            </tr>
          )}

          {chatbots.map((bot) => (
            <tr key={bot._id || bot.botName}>
              <td>{bot.botName}</td>
              <td>{bot.platform}</td>
              <td>{bot.intent}</td>
              <td>{bot.response}</td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(bot._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
