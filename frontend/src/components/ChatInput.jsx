import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

const ChatInput = ({ onSend, variant = 'standard' }) => {

  const [text, setText] = useState('');
  const [language, setLanguage] = useState("en-IN"); // 🌍 language selection

  // 🎤 Speech to Text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;   // 👈 selected language
    recognition.start();

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setText(voiceText);
    };
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    // Only trigger submit on pure Enter key (no shift, no ctrl)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Stop newline from forming in input
      handleSubmit(e);
    }
  };

  const isLarge = variant === 'large';

  return (
    <form onSubmit={handleSubmit} className="relative group w-full">

      <div
        className={`relative flex items-center bg-[#2f2f2f] border border-white/5 shadow-sm rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#4f4f4f] transition-all
        ${isLarge ? 'py-1' : ''}`}
      >

        {/* 🌍 Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-[#2f2f2f] text-[#ececec] text-sm px-2 border-none outline-none"
        >
          <option value="en-IN">English</option>
          <option value="hi-IN">Hindi</option>
          <option value="te-IN">Telugu</option>
        </select>

        {/* Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about attendance, marks, fees, exams..."
          className="flex-1 bg-transparent border-none text-[#ececec] placeholder-[#6e6e6e] py-3.5 px-2 focus:outline-none focus:ring-0 text-[15px]"
        />

        {/* 🎤 Voice Button */}
        <button
          type="button"
          onClick={startListening}
          className="p-2 text-[#8e8e8e] hover:text-white transition-colors"
          title="Voice Input"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <div className="pr-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded-lg bg-[#5865F2] text-white disabled:opacity-30 disabled:bg-[#3f3f3f] disabled:text-[#8e8e8e] hover:bg-[#4752C4] transition-colors flex items-center justify-center shrink-0 w-8 h-8"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </form>
  );
};

export default ChatInput;