"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [currentBotMessage, setCurrentBotMessage] = useState("");

  const animateBotResponse = (response) => {
    let i = 0;
    const fullText = response;

    const addCharacter = () => {
      if (i < fullText.length) {
        setCurrentBotMessage(fullText.substring(0, i + 1));
        i++;
        setTimeout(addCharacter, 10);
      } else {
        setConversation((conv) => [
          ...conv,
          { sender: "SemanticBot", text: fullText },
        ]);
        setCurrentBotMessage("");
      }
    };
    addCharacter();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (isAnswering || !message) return;

    setIsAnswering(true);
    setConversation([...conversation, { sender: "You", text: message }]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const { answer } = await response.json();

      animateBotResponse(answer);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setConversation([
        ...conversation,
        {
          sender: "SemanticBot",
          text: "Sorry, there was a problem getting a response.",
        },
      ]);
    } finally {
      setIsAnswering(false);
    }
  };
  return (
    <Card className="w-3/4 h-[75vh] grid grid-rows-[min-content,1fr,min-content]">
      <CardHeader>
        <CardTitle>Semantic Chat Bot</CardTitle>
        <CardDescription>Educaia's Interview by Ismael :)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {conversation.map((msg, index) => (
          <div key={index} className="flex gap-x-4 text-slate-700 text-sm">
            {msg.sender === "SemanticBot" && (
              <Avatar>
                <AvatarFallback>aia</AvatarFallback>
                <AvatarImage src="/educaia_avatar.webp" alt="Educaia Avatar" />
              </Avatar>
            )}
            {msg.sender === "You" && (
              <Avatar>
                <AvatarFallback>you</AvatarFallback>
                <AvatarImage
                  src="/personal_avatar.webp"
                  alt="Personal Avatar"
                />
              </Avatar>
            )}
            <p className="leading-relaxed">
              <span className={`block text-slate-800 font-bold`}>
                {msg.sender}
              </span>
              {msg.text}
            </p>
          </div>
        ))}
        {currentBotMessage && (
          <div className="flex gap-x-4 text-slate-700 text-sm">
            <Avatar>
              <AvatarFallback>aia</AvatarFallback>
              <AvatarImage src="/educaia_avatar.webp" alt="Educaia Avatar" />
            </Avatar>
            <p className="leading-relaxed">
              <span className="block text-slate-800 font-bold">
                SemanticBot:
              </span>
              {currentBotMessage}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form className="flex w-full gap-x-2" onSubmit={handleSendMessage}>
          <Input
            placeholder="Message SemanticBot..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

