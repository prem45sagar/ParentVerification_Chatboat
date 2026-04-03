import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import ChatLayout from './components/ChatLayout';

function App() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1E1E1E]">
      <ChatLayout 
        studentInfo={studentInfo} 
        onLogout={() => setStudentInfo(null)} 
        onLoginRequest={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal Overlay */}
      {isAuthOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            {/* Close button for Auth Modal */}
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <AuthScreen 
              onAuthenticated={(info) => {
                setStudentInfo(info);
                setIsAuthOpen(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
