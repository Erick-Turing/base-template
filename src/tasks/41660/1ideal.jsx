// Import necessary components and hooks for building the application
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock WebSocket for demonstration purposes (should be replaced with a real implementation in production)
const mockWebSocket = {
  send: (message) => console.log("Sent:", message), // Logs sent messages for debugging
  onmessage: null, // Placeholder for message handling
};

// Context for managing user authentication across the app
const AuthContext = React.createContext(null);

// Custom hook to manage authentication state
function useAuth() {
  const [user, setUser] = useState(null);

  // Function to log in the user by setting their username
  const login = (username) => {
    setUser({ username });
  };

  // Function to log out the user by clearing the state
  const logout = () => {
    setUser(null);
  };

  return { user, login, logout };
}

// Login form component to capture and submit username
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username); // Calls onLogin with the entered username
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input field for username */}
      <Input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {/* Submit button */}
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}

// Component to render individual chat messages
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
        {/* Avatar to display user's profile or initials */}
        <Avatar className="w-8 h-8">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.username}`} />
          <AvatarFallback>{message.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        {/* Message bubble */}
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

// Chat window to display all messages and auto-scroll to the latest message
function ChatWindow({ messages, currentUser }) {
  const scrollAreaRef = useRef(null);

  // Scroll to the bottom whenever messages are updated
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

// Input field for sending chat messages
function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message); // Sends the message if it's not empty
      setMessage(""); // Clears the input field
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      {/* Message input */}
      <Input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow"
      />
      {/* Send button */}
      <Button type="submit">Send</Button>
    </form>
  );
}

// Main chat component to manage messages and WebSocket interactions
function Chat() {
  const { user, logout } = React.useContext(AuthContext); // Access user authentication context
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Simulate receiving messages periodically
    const interval = setInterval(() => {
      const newMessage = {
        username: "System",
        text: `New message at ${new Date().toLocaleTimeString()}`,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }, 5000);

    // Handle incoming WebSocket messages
    mockWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      clearInterval(interval); // Clean up interval on unmount
      mockWebSocket.onmessage = null; // Reset WebSocket handler
    };
  }, []);

  // Sends a message via WebSocket and updates the local state
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
          {/* Logout button */}
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat window to display messages */}
        <ChatWindow messages={messages} currentUser={user} />
        {/* Input field to send messages */}
        <ChatInput onSendMessage={sendMessage} />
      </CardContent>
    </Card>
  );
}

// Root application component to manage authentication and render the chat
export default function App() {
  const auth = useAuth(); // Custom authentication hook

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {auth.user ? (
          <Chat /> // Renders the chat interface if the user is logged in
        ) : (
          // Renders the login form if the user is not authenticated
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
