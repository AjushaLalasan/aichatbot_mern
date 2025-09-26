// src/__tests__/App.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import ChatBotForm from '../components/ChatBotForm';
import ChatBotList from '../components/ChatBotList';
import * as api from '../services/api';
import axios from 'axios';

jest.mock('../services/api');
jest.mock('axios');

const mockBots = [
  { id: 1, botName: 'SalesBot', platform: 'WhatsApp', intent: 'Greet', response: 'Hello!' },
  { id: 2, botName: 'SupportBot', platform: 'Website', intent: 'Help', response: 'How can I help?' }
];

describe('AI ChatBot Integration Platform - Easy Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1 ✅ renders app title
  test('renders app title', () => {
    api.getChatBots.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText(/AI ChatBot Integration Platform/i)).toBeInTheDocument();
  });

  // 2 ✅ fetches and displays chatbots
  test('fetches and displays chatbots', async () => {
    api.getChatBots.mockResolvedValueOnce(mockBots);
    render(<App />);
    expect(await screen.findByText('SalesBot')).toBeInTheDocument();
    expect(screen.getByText('SupportBot')).toBeInTheDocument();
  });

  // 3 ✅ shows empty message if no chatbots
  test('shows empty table if no chatbots', async () => {
    api.getChatBots.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/No chatbots found/i)).toBeInTheDocument();
    });
  });

  // 4 ✅ handles fetch error gracefully
  test('handles fetch error gracefully', async () => {
    api.getChatBots.mockRejectedValueOnce(new Error('Error fetching'));
    render(<App />);
    expect(await screen.findByText(/AI ChatBot Integration Platform/i)).toBeInTheDocument();
  });

  // 5 ✅ renders chatbot form inputs
  test('renders chatbot form inputs', () => {
    render(<ChatBotForm onAdd={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Bot Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Intent/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Response/i)).toBeInTheDocument();
  });

  // 6 ✅ submits form and calls addChatBot API
  test('submits form and calls addChatBot API', async () => {
    const mockAdd = jest.fn();
    api.addChatBot.mockResolvedValueOnce({});
    render(<ChatBotForm onAdd={mockAdd} />);
    fireEvent.change(screen.getByPlaceholderText(/Bot Name/i), { target: { value: 'NewBot' } });
    fireEvent.change(screen.getByPlaceholderText(/Intent/i), { target: { value: 'Ask' } });
    fireEvent.change(screen.getByPlaceholderText(/Response/i), { target: { value: 'Sure!' } });
    fireEvent.click(screen.getByRole('button', { name: /Add ChatBot/i }));
    await waitFor(() => expect(api.addChatBot).toHaveBeenCalled());
  });

  // 7 ✅ handles delete button click
test('handles delete button click', async () => {
  api.getChatBots.mockResolvedValueOnce(mockBots);
  axios.delete.mockResolvedValueOnce({});
  render(<App />);
  expect(await screen.findByText('SalesBot')).toBeInTheDocument();
  window.confirm = jest.fn(() => true);
  fireEvent.click(screen.getAllByText(/Delete/i)[0]);
  await waitFor(() =>
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/api/chatbots/1'))
  );
});


  // 8 ✅ handles delete API error
  test('handles delete API error', async () => {
    api.getChatBots.mockResolvedValueOnce(mockBots);
    axios.delete.mockRejectedValueOnce(new Error('Delete error'));
    render(<App />);
    expect(await screen.findByText('SalesBot')).toBeInTheDocument();
    window.confirm = jest.fn(() => true);
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });

  // 9 ✅ displays correct platform and intent
  test('displays correct platform and intent', () => {
    render(<ChatBotList chatbots={mockBots} onRefresh={jest.fn()} />);
    expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
    expect(screen.getByText('Greet')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  // 10 ✅ filters by platform
  test('filters chatbots by platform', async () => {
    api.getChatBots.mockResolvedValueOnce(mockBots);
    api.getIntegrationStatus.mockResolvedValueOnce([mockBots[0]]);
    render(<App />);
    expect(await screen.findByText('SalesBot')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Filter by Platform/i), { target: { value: 'WhatsApp' } });
    await waitFor(() => {
      expect(api.getIntegrationStatus).toHaveBeenCalledWith('WhatsApp');
    });
  });
});
