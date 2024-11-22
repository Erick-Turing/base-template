import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatMessage = ({ message, isUser }) => (
  <div className={`mb-2 ${isUser ? 'text-right' : 'text-left'}`}>
    <div className={`inline-block p-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
      {message}
    </div>
  </div>
);

const ChatWindow = ({ messages, onSend }) => {
  const [message, setMessage] = useState('');
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle>Chat Room</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
          ))}
          <div ref={endOfMessagesRef} />
        </ScrollArea>
      </CardContent>
      <div className="p-4">
        <Input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..."
          className="mr-2"
        />
        <Button onClick={() => {
          if(message.trim()) {
            onSend(message);
            setMessage('');
          }
        }}>Send</Button>
      </div>
    </Card>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://your-websocket-server-url');

    ws.current.onopen = () => setConnected(true);
    ws.current.onclose = () => setConnected(false);
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = (text) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        username: username || 'Anonymous',
        text: text,
        isUser: true,
      }));
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter username"
            />
            <Button onClick={() => setConnected(true)} className="mt-2">Connect</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 sm:p-4">
      <ChatWindow messages={messages} onSend={sendMessage} />
    </div>
  );
}