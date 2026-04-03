import React, { useState, useRef, useEffect } from 'react';
import { LogOut, GraduationCap } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import API_BASE from '../api/config';

const ChatLayout = ({ studentInfo, onLogout, onLoginRequest }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const isLoggedIn = !!studentInfo;
  const regNo = studentInfo?.regNo || 'Guest';
  const studentFullName = studentInfo?.name || 'Visitor';
  const studentFirstName = studentFullName.split(' ')[0];
  // Initials for avatar
  const initials = isLoggedIn
    ? studentFullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EC';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // When user logs out, clear messages to "redirect" to welcome screen
  useEffect(() => {
    if (!isLoggedIn) {
      setMessages([]);
    }
  }, [isLoggedIn]);

  const speakResponse = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      // Strip markdown-like characters (*, `, etc) for cleaner speech
      const cleanText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-IN'; // Works well for Indian English and basic Hindi
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (text, isVoice = false) => {
    if (!text.trim() || isLoading) return;

    if (!isLoggedIn) {
      onLoginRequest();
      return;
    }

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      text,
      data: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, message: text }),
      });
      const data = await res.json();

      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        type: data.type || 'text',
        text: data.text || '',
        data: data.data || null,
        suggestions: data.suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);

      // If text was spoken, speak the response back!
      if (isVoice && data.text) {
        speakResponse(data.text);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        type: 'text',
        text: '⚠️ Could not reach the backend server. Please make sure the Flask server is running on port 5001.',
        data: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "Show attendance",
    "Show CGPA",
    "Show marks",
    "Show fees",
    "Show backlogs",
    "Academic Calendar",
    "Faculty contact",
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#1E1E1E] overflow-hidden text-textMain relative">

      {/* Header */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between z-10 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-white/90">{initials}</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-white/90 leading-tight">
              {isLoggedIn ? studentFullName : 'EduConnect Assistant'}
            </span>
            <span className="text-xs text-textMuted/70 font-medium tracking-wide">
              {isLoggedIn ? regNo : 'Welcome'}
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-textMuted hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={onLoginRequest}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white font-medium transition-colors duration-200 shadow-md"
          >
            <span className="text-sm">Login</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center w-full relative z-10 overflow-hidden">

        {messages.length === 0 ? (
          // Empty State / Welcome Screen
          <div className="flex-1 w-full flex flex-col items-center justify-center px-4 -mt-16">
            <div className="flex flex-col items-center text-center space-y-3 mb-8">
              <div className="mb-2">
                <GraduationCap className="w-12 h-12 text-[#8b5cf6]" strokeWidth={1.5} />
              </div>

              {isLoggedIn ? (
                <>
                  <h1 className="text-2xl font-semibold text-white/90">Good evening, {studentFirstName}</h1>
                  <p className="text-[#8e8e8e] text-sm">Ask me anything about {studentFullName}'s academics</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold tracking-tight text-white/90">EduConnect AI</h1>
                  <p className="text-[#a0a0a0] text-sm max-w-md mx-auto leading-relaxed">
                    A smart assistant to help parents securely track student attendance, academic performance, fees, and more.
                    Login with a valid RegNo and Mobile Number to view data.
                  </p>
                </>
              )}
            </div>

            <div className="w-full max-w-3xl">
              <ChatInput onSend={handleSendMessage} variant="large" disabled={isLoading} />

              <div className="text-center mt-3 text-[11px] text-[#5e5e5e]">
                Enter to send — Shift+Enter for new line
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action)}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-[#a0a0a0] text-sm transition-colors disabled:opacity-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Active Chat Screen
          <>
            <div className="flex-1 overflow-y-auto w-full scroll-smooth pt-4 px-4 pb-32">
              <div className="max-w-3xl mx-auto space-y-8">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} onSend={handleSendMessage} />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-4 w-full flex-row">
                    <div className="shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg border border-white/10">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-textMuted/60 text-sm mt-2">
                      <span className="w-1.5 h-1.5 bg-textMuted/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-textMuted/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-textMuted/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>

            <div className="w-full absolute bottom-0 left-0 pt-4 pb-6 px-4 bg-gradient-to-t from-[#1E1E1E] via-[#1E1E1E] to-transparent z-10 flex justify-center pointer-events-none">
              <div className="w-full max-w-3xl pointer-events-auto">
                <ChatInput onSend={handleSendMessage} variant="standard" disabled={isLoading} />
                <p className="text-center text-[11px] text-textMuted/60 mt-3 hidden md:block">
                  EduConnect Assistant can make mistakes. Please verify important information with the academic office.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChatLayout;
