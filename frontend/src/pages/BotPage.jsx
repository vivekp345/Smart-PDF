import { useState, useRef, useEffect } from 'react';
import { sendMessageToAi } from '../api/chatApi';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const BotPage = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add user message to UI immediately
    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // 2. Prepare History for Gemini
      // FIX: We use .slice(1) to REMOVE the initial "Hello" greeting.
      // Gemini crashes if the history starts with a 'model' message.
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // 3. Send to Backend
      const data = await sendMessageToAi(userMessage.text, history);
      
      // 4. Add AI response to UI
      setMessages([...newMessages, { role: 'model', text: data.reply }]);
    } catch (error) {
      console.error('Chat failed', error);
      setMessages([...newMessages, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-poppins flex items-center gap-2">
          <Sparkles className="text-[#9C27B0]" /> AI Chat Assistant
        </h1>
        <p className="text-gray-400">Ask questions, draft emails, or brainstorm ideas.</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#1B1F24] rounded-2xl border border-white/5 p-4 overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 pr-2 custom-scrollbar">
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-[#6FFFB0]/20' : 'bg-[#9C27B0]/20'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-[#6FFFB0]" /> : <Bot className="w-5 h-5 text-[#9C27B0]" />}
              </div>

              {/* Bubble */}
              <div 
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-[#6FFFB0]/10 text-white border border-[#6FFFB0]/20 rounded-tr-none' 
                    : 'bg-white/5 text-gray-300 border border-white/10 rounded-tl-none'
                  }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-full bg-[#9C27B0]/20">
                 <Bot className="w-5 h-5 text-[#9C27B0]" />
               </div>
               <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                 <span className="text-xs text-gray-400">Thinking...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#0f1216] border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-[#9C27B0] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-2 p-2 bg-[#9C27B0] hover:bg-[#7B1FA2] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BotPage;