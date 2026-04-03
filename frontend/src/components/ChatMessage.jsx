import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import AttendanceWidget from './widgets/AttendanceWidget';
import AcademicPerformanceWidget from './widgets/AcademicPerformanceWidget';
import FinancialWidget from './widgets/FinancialWidget';
import NotificationsWidget from './widgets/NotificationsWidget';
import SupportWidget from './widgets/SupportWidget';
import InsightsWidget from './widgets/InsightsWidget';
import AcademicCalendarWidget from './widgets/AcademicCalendarWidget';

const ChatMessage = ({ message, onSend }) => {
  const isBot = message.sender === 'bot';

  const renderWidget = () => {
    switch (message.type) {
      case 'attendance_widget':
        return <AttendanceWidget data={message.data} />;
      case 'performance_widget':
        return <AcademicPerformanceWidget data={message.data} />;
      case 'financial_widget':
        return <FinancialWidget data={message.data} />;
      case 'notifications_widget':
        return <NotificationsWidget data={message.data} />;
      case 'support_widget':
        return <SupportWidget data={message.data} />;
      case 'insights_widget':
        return <InsightsWidget data={message.data} />;
      case 'calendar_widget':
        return <AcademicCalendarWidget data={message.data} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 w-full ${isBot ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className="shrink-0 mt-1">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg border border-white/10">
            <Bot className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-textMuted" />
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-1.5 min-w-0 max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`flex items-center gap-2 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="text-[13px] font-semibold text-white/90">
            {isBot ? 'EduConnect Assistant' : 'You'}
          </span>
          <span className="text-[11px] text-textMuted/50">{message.timestamp}</span>
        </div>

        {message.text && (
          <div className={`text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap font-light tracking-wide ${isBot ? 'text-left' : 'text-right'}`}>
            <p>{message.text}</p>
          </div>
        )}

        {message.type !== 'text' && message.data && (
          <div className="mt-4 w-full max-w-xl">
            {renderWidget()}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && isBot && (
          <div className="flex flex-col gap-2 mt-2 pt-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => onSend && onSend(suggestion)}
                className="px-4 py-2.5 rounded-xl bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/20 text-[13px] text-[#c4b5fd] hover:text-white transition-colors text-left font-medium disabled:opacity-50 break-words"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
