import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Text,
  Flex,
  Input,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/chat")({
  component: Chat,
});

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // 使用固定颜色
  const userBgColor = "blue.500";
  const botBgColor = "gray.100";
  const userTextColor = "white";
  const botTextColor = "gray.800";

  // 滚动到底部的函数，只在消息容器内滚动
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // 消息变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage: Message = {
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);
      
      try {
        // TODO: Replace with actual API call
        // Simulate AI response with delay
        setTimeout(() => {
          const aiMessage: Message = {
            text: `This is a response to: "${inputMessage}"\n\nI can provide more detailed information if you'd like. Feel free to ask follow-up questions or explore other topics.`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
        }, 1500);

      } catch (error) {
        console.error("Error sending message:", error);
        setIsLoading(false);
        
        // Add error message
        setMessages(prev => [...prev, {
          text: "Sorry, there was an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Container maxW="full" p={4}>
      {/* 聊天界面容器 */}
      <Box 
        maxW="container.lg" 
        mx="auto"
        mt={4}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        height="1100px"  // 固定高度
        position="relative"
      >
        {/* Header */}
        <Flex 
          p={4} 
          justify="space-between" 
          align="center"
          borderBottomWidth="1px"
          bg="white"
        >
          <Text fontWeight="bold" fontSize="lg">Chat Assistant</Text>
          <Button
            onClick={clearChat}
            size="sm"
            variant="ghost"
          >
            <Box mr={1}><FiTrash2 /></Box>
            Clear
          </Button>
        </Flex>
        
        {/* Messages Area */}
        <Box 
          ref={messagesContainerRef}
          height="calc(100% - 130px)"
          overflowY="auto" 
          p={4}
          bg="gray.50"
        >
          {messages.length === 0 ? (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              h="100%"
              color="gray.500"
            >
              <Text fontSize="xl" fontWeight="medium">How can I help you today?</Text>
              <Text mt={2}>Ask me anything, and I'll do my best to assist you.</Text>
            </Flex>
          ) : (
            <Box>
              {messages.map((message, index) => (
                <Box key={index} mb={4}>
                  <Flex justify={message.isUser ? "flex-end" : "flex-start"}>
                    <Box
                      maxW="70%"
                      p={3}
                      borderRadius="lg"
                      bg={message.isUser ? userBgColor : botBgColor}
                      color={message.isUser ? userTextColor : botTextColor}
                      boxShadow="sm"
                    >
                      <Text>{message.text}</Text>
                      <Text 
                        fontSize="xs" 
                        opacity={0.8} 
                        textAlign="right" 
                        mt={1}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </Box>
          )}
          
          {isLoading && (
            <Flex align="center" ml={2} mt={4}>
              <Spinner size="sm" />
              <Text ml={2} fontSize="sm" color="gray.500">
                Thinking...
              </Text>
            </Flex>
          )}
        </Box>
        
        {/* Input Area - 固定在底部 */}
        <Flex 
          p={4} 
          borderTopWidth="1px"
          bg="white"
          position="absolute"
          bottom="0"
          width="100%"
        >
          <Input
            flex={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            mr={2}
            disabled={isLoading}
            bg="white"
          />
          <Button
            colorScheme="blue"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
          >
            <Box mr={1}><FiSend /></Box>
            Send
          </Button>
        </Flex>
      </Box>
    </Container>
  );
}