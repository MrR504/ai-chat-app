'use client';
import { Suspense, useEffect, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button';
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Loader2, Trash, User } from 'lucide-react';
import ChatsList from '@/components/ChatsList';

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAIWriting, setIsAIWriting] = useState<boolean>(false);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  function handleClearLocalStorage() {
    localStorage.removeItem('chatMessages');
    window.location.reload();
  }


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!inputMessage.trim()) {
      return;
    }

    try {
      setIsAIWriting(true);

      const updatedMessages = [...messages, { role: 'user', content: inputMessage }];

      setMessages(updatedMessages);
      setInputMessage('');

      const response = await fetch(`http://85.175.251.117:5001/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages, // Pass the updated messages array
          temperature: 0.7,
          max_tokens: -1,
          stream: false
        }),
      });

      const data = await response.json();

      const systemCompletion = data.choices[0].message.content;

      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: systemCompletion }]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsAIWriting(false);
    }
  }

  return (
    <div className=''>
      <div className='container grid box-border content-between relative'>
        <div className='p-2 mb-28 h-full'>
          <ul className=''>
            {messages && messages.map((message, index) => (
              <li key={index} id={message.role} className='flex'>
                {message.role === 'assistant' && (
                  <Avatar className='me-3'>
                    <AvatarFallback><Bot /></AvatarFallback>
                  </Avatar>
                )}
                <div className={`mb-2 p-2 rounded-lg ${message.role === 'user' && 'bg-muted w-fit ms-auto'} ${message.role === 'assistant' && 'bg-primary text-primary-foreground w-fit me-auto'}`}>
                  {message.role === 'system' ? <b>{message.content}</b> : <article className='prose'><ReactMarkdown>{message.content}</ReactMarkdown></article>}
                </div>
                {message.role === 'user' && (
                  <Avatar className='ms-3'>
                    <AvatarFallback><User /></AvatarFallback>
                  </Avatar>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className='pb-5 bg-white dark:bg-zinc-950 container left-0 right-0 fixed bottom-0 w-full'>
          <form onSubmit={handleSubmit} acceptCharset="UTF-8">
            {isAIWriting && (<span className='flex items-center text-muted-foreground mb-2'><Loader2 className='animate-spin h-4 w-4 me-2' />Генерация</span>)}
            <div className='flex space-x-3 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg'>
              <Input
                type="text"
                placeholder="Напишите сообщение..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)} />
              {(messages.length > 0) &&
                <Button type='button' variant="destructive" size="icon" onClick={() => handleClearLocalStorage()}>
                  <Trash className="h-4 w-4" />
                </Button>}
              <Button type="submit">Отправить</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
