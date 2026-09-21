import React, { useState } from 'react';
import { Mic, MessageSquare, Sparkles, X } from 'lucide-react';
import { KisanChatbot } from './KisanChatbot';
import { useLanguage } from '../../context/LanguageContext';

export const KisanChatbotWidget = ({
  isOpen: controlledIsOpen,
  onOpenChange,
  initialPrompt = '',
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleOpen = () => {
    setShowTooltip(false);
    if (isControlled) {
      onOpenChange?.(true);
    } else {
      setUncontrolledIsOpen(true);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setUncontrolledIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-[999] flex flex-col items-end gap-2 pointer-events-auto">
          {/* First-time helper tooltip */}
          {showTooltip && (
            <div className="bg-slate-950/90 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center gap-2.5 animate-bounce">
              <span className="text-base">🎙️</span>
              <div className="text-left">
                <p className="font-extrabold text-emerald-300">
                  {isHindi ? 'व्यापार व लॉजिस्टिक्स सलाहकार से बोलें!' : 'Speak with Trade & Logistics Advisor!'}
                </p>
                <p className="text-[10px] text-slate-300">
                  {isHindi ? 'स्वाति व रोहन से हिंदी या इंग्लिश में पूछें' : 'Consult Swati or Rohan in Hindi & English'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Floating Trigger Button */}
          <button
            type="button"
            onClick={handleOpen}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 hover:from-emerald-700 hover:to-teal-900 text-white rounded-full shadow-2xl border-2 border-emerald-400/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Open KisanDirect Trade Advisory / किसानडायरेक्ट व्यापार परामर्श"
          >
            {/* Pulsing Voice Wave Ring */}
            <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping opacity-75" />

            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <Mic className="w-4 h-4 animate-pulse text-amber-300" />
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-xs font-black text-white leading-tight flex items-center gap-1">
                <span>{isHindi ? 'व्यापार परामर्श' : 'Trade Advisor'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </p>
              <p className="text-[10px] text-emerald-300 font-semibold">
                {isHindi ? '🎙️ बोलकर पूछें (Voice AI)' : '🎙️ Executive Voice AI'}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Render Chatbot Dialog */}
      <KisanChatbot
        isOpen={isOpen}
        onClose={handleClose}
        initialPrompt={initialPrompt}
      />
    </>
  );
};
