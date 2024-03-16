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
  const [editingIndex, setEditingIndex] = useState(null);
  const [editMessage, setEditMessage] = useState("");

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

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditMessage("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditMessage(conversation[index].text);
  };

  const saveEditMessage = async (e) => {
    e.preventDefault();

    if (editMessage.trim() === "") return;

    const updatedConversation = [...conversation];
    updatedConversation[editingIndex].text = editMessage;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: editMessage }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const { answer } = await response.json();

      if (editingIndex + 1 < updatedConversation.length) {
        updatedConversation[editingIndex + 1].text = answer;
      } else {
        updatedConversation.push({ sender: "SemanticBot", text: answer });
      }

      setConversation(updatedConversation);
      
      // DB UPDATE LOGIC HERE
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      if (editingIndex !== null) {
        updatedConversation[editingIndex] = {
          ...updatedConversation[editingIndex],
          text: "Sorry, there was a problem getting a response.",
        };
        if (
          editingIndex + 1 < updatedConversation.length &&
          updatedConversation[editingIndex + 1].sender === "SemanticBot"
        ) {
          updatedConversation[editingIndex + 1] = {
            ...updatedConversation[editingIndex + 1],
            text: "Sorry, there was a problem getting a response.",
          };
        }
      }
      setConversation(updatedConversation);
    }

    setEditingIndex(null);
    setEditMessage("");
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

      if (!response.ok) throw new Error("Network response was not ok");

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
      <CardContent className="overflow-y-auto">
        {conversation.map((msg, index) => (
          <div key={index} className="flex gap-x-4 mt-4 text-slate-700 text-sm">
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
            {editingIndex === index ? (
              <form className="flex gap-x-2 w-full" onSubmit={saveEditMessage}>
                <Input
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  autoFocus
                />
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-transparent border border-black text-slate-700 hover:text-white hover:bg-red-400"
                >
                  Cancel
                </Button>
              </form>
            ) : (
              <p className="leading-relaxed">
                <span className={`block text-slate-800 font-bold`}>
                  {msg.sender}
                </span>
                {msg.text}
                {msg.sender === "You" && (
                  <button className="ml-2" onClick={() => handleEdit(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width={12}
                      height={12}
                    >
                      <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                    </svg>
                  </button>
                )}
              </p>
            )}
          </div>
        ))}
        {currentBotMessage && (
          <div className="flex gap-x-4 text-slate-700 mt-4 text-sm">
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
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}

