import React from 'react';
import { Send, User, Bot, Loader2, Info, Shield } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { askWatchdog } from '../services/gemini';
import { cn } from '../lib/utils';
import { CountyDocument } from '../data';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

interface WatchdogChatProps {
  document: CountyDocument | null;
}

export function WatchdogChat({ document }: WatchdogChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: document 
        ? `Sasa! I am ready to help you understand the **${document.title}**. What would you like to know about the allocations or audit findings for your ward?`
        : "Sasa! Please select a County and Document to begin. I can explain budgets, auditor reports, and Hansard records in plain language."
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const context = document ? document.content : "No document selected. Provide general civic education on Kenyan county budgets.";
      const answer = await askWatchdog(input, context);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: answer };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = { 
        id: 'error', 
        role: 'bot', 
        text: "Samahani, I encountered an error. Please check if your Gemini API key is configured correctly." 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm">
            <Bot size={16} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Watchdog Assistant</h3>
            <p className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
               <Shield size={10} /> GEMINI PRO 1.5 VERIFIED
            </p>
          </div>
        </div>
        {document && (
          <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[9px] font-bold border border-blue-100 uppercase">
            {document.type} • {document.year}
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-white scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "items-start"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                msg.role === 'bot' 
                  ? "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none" 
                  : "bg-brand-blue text-white rounded-tr-none"
              )}>
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
              {msg.role === 'bot' && document && (
                <div className="flex gap-2 mt-1 px-1">
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded">Source: {document.title.split(' ').slice(0, 3).join(' ')}...</span>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded">Gazette Verified</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-3 items-center text-slate-400 text-[10px] items-center px-2">
            <Loader2 className="animate-spin" size={12} />
            <span className="uppercase tracking-widest font-bold">Watchdog is thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={document ? "Type your question here... (e.g. Where is my tax going?)" : "Select a document first..."}
            disabled={!document || isLoading}
            className="w-full bg-white border border-slate-300 rounded-full px-6 py-4 pr-16 shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!document || isLoading || !input.trim()}
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
