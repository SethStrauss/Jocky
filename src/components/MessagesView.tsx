import React, { useState } from 'react';
import { Conversation, Message } from '../types';
import './MessagesView.css';

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: '1',
    artistId: '1',
    artistName: 'DJ Terka',
    lastMessage: 'See you Friday at 19:00!',
    lastMessageTime: new Date(2026, 1, 20, 14, 30),
    unreadCount: 2,
    eventId: '1',
    eventName: 'Friday Night Live'
  },
  {
    id: '2',
    artistId: '2',
    artistName: 'AronChupa',
    lastMessage: 'Thanks for the offer!',
    lastMessageTime: new Date(2026, 1, 19, 16, 20),
    unreadCount: 0,
    eventId: '2',
    eventName: 'Saturday Party'
  },
];

// Mock messages
const mockMessages: { [key: string]: Message[] } = {
  '1': [
    {
      id: '1',
      conversationId: '1',
      senderId: 'venue',
      senderName: 'You',
      receiverId: '1',
      text: 'Hi! I sent you an offer for Friday Night Live on Feb 28th. Are you available?',
      timestamp: new Date(2026, 1, 20, 10, 0),
      isRead: true,
      eventId: '1',
      eventName: 'Friday Night Live'
    },
    {
      id: '2',
      conversationId: '1',
      senderId: '1',
      senderName: 'DJ Terka',
      receiverId: 'venue',
      text: 'Yes! I\'d love to play. What time should I arrive for setup?',
      timestamp: new Date(2026, 1, 20, 12, 15),
      isRead: true
    },
    {
      id: '3',
      conversationId: '1',
      senderId: 'venue',
      senderName: 'You',
      receiverId: '1',
      text: 'Perfect! Can you be there at 19:00 for soundcheck?',
      timestamp: new Date(2026, 1, 20, 13, 0),
      isRead: true
    },
    {
      id: '4',
      conversationId: '1',
      senderId: '1',
      senderName: 'DJ Terka',
      receiverId: 'venue',
      text: 'See you Friday at 19:00!',
      timestamp: new Date(2026, 1, 20, 14, 30),
      isRead: false
    }
  ],
  '2': [
    {
      id: '5',
      conversationId: '2',
      senderId: 'venue',
      senderName: 'You',
      receiverId: '2',
      text: 'Would you be interested in playing Saturday March 1st?',
      timestamp: new Date(2026, 1, 19, 15, 0),
      isRead: true
    },
    {
      id: '6',
      conversationId: '2',
      senderId: '2',
      senderName: 'AronChupa',
      receiverId: 'venue',
      text: 'Thanks for the offer!',
      timestamp: new Date(2026, 1, 19, 16, 20),
      isRead: true
    }
  ]
};

const MessagesView: React.FC = () => {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: 'venue',
      senderName: 'You',
      receiverId: selectedConversation.artistId,
      text: newMessage,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(c =>
    c.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-view">
      <h1 className="messages-title">Messages</h1>

      <div className="messages-content">
        {/* Conversations List */}
        <div className="conversations-panel">
          <input
            type="text"
            placeholder="Search conversations..."
            className="message-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="conversations-list">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="conversation-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                
                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-name">{conversation.artistName}</span>
                    <span className="conversation-time">{formatTime(conversation.lastMessageTime)}</span>
                  </div>
                  
                  {conversation.eventName && (
                    <div className="conversation-event">{conversation.eventName}</div>
                  )}
                  
                  <div className="conversation-preview">
                    {conversation.lastMessage}
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="unread-badge">{conversation.unreadCount}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="message-panel">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div className="chat-info">
                  <div className="chat-name">{selectedConversation.artistName}</div>
                  {selectedConversation.eventName && (
                    <div className="chat-event">Event: {selectedConversation.eventName}</div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === 'venue' ? 'message-sent' : 'message-received'}`}
                  >
                    <div className="message-bubble">
                      <div className="message-text">{message.text}</div>
                      <div className="message-time">{formatMessageTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="empty-messages">
              <svg viewBox="0 0 24 24" fill="currentColor" className="empty-icon">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
