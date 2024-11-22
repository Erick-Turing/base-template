import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock WebSocket for demonstration purposes
const mockWebSocket = {
  send: (message) => console.log("Sent:", message),
  onmessage: null,
};

const AuthContext = React.createContext(null);

function useAuth() {
  const [user, setUser] = useState(null);

  const login = (username) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}

function ChatMessage({ message, isOwnMessage }) {
  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`flex items-start ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.username}`} />
          <AvatarFallback>{message.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={`mx-2 px-4 py-2 rounded-lg ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <p>{message.text}</p>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ messages, currentUser }) {
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message}
          isOwnMessage={message.username === currentUser.username}
        />
      ))}
    </ScrollArea>
  );
}

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">Send</Button>
    </form>
  );
}

function Chat() {
  const { user, logout } = React.useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Simulate receiving messages
    const interval = setInterval(() => {
      const newMessage = {
        username: "System",
        text: `New message at ${new Date().toLocaleTimeString()}`,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, 5000);

    mockWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      clearInterval(interval);
      mockWebSocket.onmessage = null;
    };
  }, []);

  const sendMessage = (text) => {
    const message = { username: user.username, text };
    mockWebSocket.send(JSON.stringify(message));
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Chat Room</span>
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChatWindow messages={messages} currentUser={user} />
        <ChatInput onSendMessage={sendMessage} />
      </CardContent>
    </Card>
  );
}

export default function App() {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {auth.user ? (
          <Chat />
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Login to Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm onLogin={auth.login} />
            </CardContent>
          </Card>
        )}
      </div>
    </AuthContext.Provider>
  );
}