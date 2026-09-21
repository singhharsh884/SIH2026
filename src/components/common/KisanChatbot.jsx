import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  User,
  Languages,
  ShieldCheck,
} from 'lucide-react';
import { aiAssistantService, QUICK_PROMPTS } from '../../services/aiAssistantService';
import { useLanguage } from '../../context/LanguageContext';
import { prepareProfessionalSpeechText, getPreferredVoice } from '../../utils/speechUtils';

const getWelcomeText = (lang) => {
  if (lang === 'hi') {
    return 'सादर नमस्कार। **किसानडायरेक्ट (KisanDirect)** व्यापार व लॉजिस्टिक्स परामर्श में आपका स्वागत है। मैं आपका व्यावसायिक कृषि सलाहकार हूँ।\n\nमंच की कार्यप्रणाली, उपज सूचीकरण, शीत-श्रृंखला परिवहन अथवा किसानों से सीधे व्यापारिक संपर्क के संबंध में आप मुझसे **बोलकर (माइक दबाकर 🎙️)** अथवा **लिखकर** परामर्श प्राप्त कर सकते हैं।';
  }
  return 'Good day. Welcome to **KisanDirect Trade & Logistics Advisory**. I am your Agricultural Operations Consultant.\n\nInquire about platform architecture, harvest listing, cold-chain telemetry, or direct farmer trade execution — speak via **microphone (🎙️)** or **type** below.';
};

export const KisanChatbot = ({
  isOpen = false,
  onClose,
  initialPrompt = '',
}) => {
  const { language: appLanguage } = useLanguage();
  const [chatLanguage, setChatLanguage] = useState(appLanguage || 'hi');
  const isHindi = chatLanguage === 'hi';

  // Voice Persona: 'female' (स्वाति - Swati) vs 'male' (रोहन - Rohan)
  const [voicePersona, setVoicePersona] = useState('female');

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: getWelcomeText(appLanguage || 'hi'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const voicesRef = useRef([]);

  // Stop all active speaking audio
  const stopSpeaking = () => {
    if (synthRef.current) {
      try {
        synthRef.current.cancel();
      } catch {}
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
      } catch {}
      audioPlayerRef.current = null;
    }
    setSpeakingMessageId(null);
  };

  // Toggle Language and update existing messages & recognition
  const handleToggleLanguage = (newLang) => {
    stopSpeaking();
    setChatLanguage(newLang);

    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang === 'hi' ? 'hi-IN' : 'en-IN';
    }

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === 'welcome') {
          return {
            ...msg,
            text: getWelcomeText(newLang),
          };
        }
        return msg;
      })
    );
  };

  // Play fluent Hindi Audio Stream (fallback when no local neural voice installed)
  const playHindiAudioStream = (preprocessedText, messageId) => {
    const sentences = preprocessedText.match(/[^.!?।\n]+[.!?।\n]*/g) || [preprocessedText];
    const chunks = [];
    let cur = '';

    for (const s of sentences) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      if ((cur + ' ' + trimmed).length < 180) {
        cur += (cur ? ' ' : '') + trimmed;
      } else {
        if (cur) chunks.push(cur);
        cur = trimmed.slice(0, 180);
      }
    }
    if (cur) chunks.push(cur);

    if (chunks.length === 0) return;

    setSpeakingMessageId(messageId);

    let idx = 0;
    const audio = new Audio();
    audioPlayerRef.current = audio;

    const playNext = () => {
      if (idx >= chunks.length) {
        setSpeakingMessageId(null);
        audioPlayerRef.current = null;
        return;
      }
      const chunk = chunks[idx++];
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=hi&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      audio.src = url;
      audio.onended = playNext;
      audio.onerror = () => {
        setSpeakingMessageId(null);
        audioPlayerRef.current = null;
      };
      audio.play().catch(() => {
        setSpeakingMessageId(null);
        audioPlayerRef.current = null;
      });
    };

    playNext();
  };

  // Speak message out loud with Executive Tone & Persona Tuning
  const speakMessage = (text, messageId) => {
    if (speakingMessageId === messageId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    // Detect if text contains Hindi characters or if chatLanguage is Hindi
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    const isTargetHindi = hasDevanagari || chatLanguage === 'hi';

    // Format text into professional spoken script
    const spokenText = prepareProfessionalSpeechText(text, isTargetHindi);
    if (!spokenText) return;

    // 1. Try finding an executive neural voice in SpeechSynthesis
    if (synthRef.current) {
      const allVoices = synthRef.current.getVoices() || voicesRef.current || [];
      const matchedVoice = getPreferredVoice(allVoices, isTargetHindi, voicePersona);

      if (matchedVoice && (isTargetHindi ? (matchedVoice.lang?.toLowerCase().includes('hi') || matchedVoice.name?.toLowerCase().includes('hindi') || matchedVoice.name?.includes('हिन्दी')) : true)) {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang || (isTargetHindi ? 'hi-IN' : 'en-IN');

        // Fine-tune tone cadence:
        // Female (Swati): rate 0.97, pitch 1.03 (warm, clear, articulate)
        // Male (Rohan): rate 0.95, pitch 0.92 (deep, steady, authoritative)
        if (voicePersona === 'female') {
          utterance.rate = 0.97;
          utterance.pitch = 1.03;
        } else {
          utterance.rate = 0.95;
          utterance.pitch = 0.92;
        }

        utterance.onstart = () => setSpeakingMessageId(messageId);
        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);

        synthRef.current.speak(utterance);
        return;
      }
    }

    // 2. If NO native Hindi voice is installed on Windows / browser:
    // Fallback to streaming audio with preprocessed professional text
    if (isTargetHindi) {
      playHindiAudioStream(spokenText, messageId);
    } else {
      // English fallback
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = 'en-IN';
        utterance.rate = voicePersona === 'female' ? 0.97 : 0.95;
        utterance.pitch = voicePersona === 'female' ? 1.02 : 0.92;
        utterance.onstart = () => setSpeakingMessageId(messageId);
        utterance.onend = () => setSpeakingMessageId(null);
        utterance.onerror = () => setSpeakingMessageId(null);
        synthRef.current.speak(utterance);
      }
    }
  };

  // Send message
  const handleSendMessage = async (textToSend = inputQuery) => {
    const query = (textToSend || '').trim();
    if (!query) return;

    // Stop active speech recognition
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = `user_${Date.now()}`;
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: query,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      // Query knowledge engine
      const result = await aiAssistantService.askQuestion(query, chatLanguage);

      setTimeout(() => {
        const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const botMessageId = `bot_${Date.now()}`;
        const botMsg = {
          id: botMessageId,
          sender: 'bot',
          text: result.response,
          timestamp: botTimestamp,
        };

        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);

        // Auto-speak if enabled
        if (autoSpeak) {
          speakMessage(result.response, botMessageId);
        }
      }, 450);
    } catch {
      setIsTyping(false);
      const fallbackMsg = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: isHindi
          ? 'माफ़ कीजिए, कोई तकनीकी त्रुटि हुई। कृपया पुनः प्रयास करें या नीचे दिए गए विकल्पों में से चुनें।'
          : 'Sorry, a temporary issue occurred. Please try again or tap one of the suggested prompts.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  // Initialize Speech Recognition & Text-to-Speech
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputQuery(currentTranscript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const populateVoices = () => {
        try {
          const list = window.speechSynthesis.getVoices();
          if (list && list.length > 0) {
            voicesRef.current = list;
          }
        } catch {}
      };

      populateVoices();
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (audioPlayerRef.current) {
        try {
          audioPlayerRef.current.pause();
          audioPlayerRef.current = null;
        } catch {}
      }
    };
  }, [chatLanguage, isHindi]);

  // Update recognition language when chatLanguage changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = isHindi ? 'hi-IN' : 'en-IN';
    }
  }, [chatLanguage, isHindi]);

  // Sync with global app language if changed
  useEffect(() => {
    if (appLanguage && appLanguage !== chatLanguage) {
      handleToggleLanguage(appLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appLanguage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isListening]);

  // Handle initial prompt if passed
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, isOpen]);

  // Handle Voice Input Toggle
  const toggleListening = () => {
    if (!speechSupported) {
      alert(
        isHindi
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Voice Input) समर्थित नहीं है। कृपया Google Chrome या Microsoft Edge का उपयोग करें।'
          : 'Voice input is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    stopSpeaking();

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Failed to start recognition:', err);
      }
    }
  };

  if (!isOpen) return null;

  const currentPrompts = QUICK_PROMPTS[chatLanguage] || QUICK_PROMPTS.hi;

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[430px] sm:h-[630px] z-[9999] flex flex-col bg-white sm:rounded-3xl shadow-2xl border border-emerald-500/40 overflow-hidden font-sans animate-in fade-in slide-in-from-bottom-6 duration-300">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-950" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-950 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-white tracking-wide">
                {isHindi ? 'व्यापार व लॉजिस्टिक्स परामर्श' : 'KisanDirect Trade Advisory'}
              </h3>
            </div>
            <p className="text-[11px] text-emerald-300/90 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isHindi ? 'सत्यापित कृषि सलाहकार • Executive AI' : 'Verified Trade Advisor • Executive AI'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => handleToggleLanguage(isHindi ? 'en' : 'hi')}
            className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold transition-colors flex items-center gap-1 text-emerald-100 cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isHindi ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Auto Speak Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              autoSpeak
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={
              autoSpeak
                ? isHindi
                  ? 'स्वतः वाचन बंद करें (Mute Auto-Speak)'
                  : 'Mute Auto-Speak'
                : isHindi
                ? 'स्वतः उत्तर बोलकर सुनाएं (Enable Auto-Speak)'
                : 'Enable Auto-Speak'
            }
          >
            {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer ml-1"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Persona Selector Sub-Bar */}
      <div className="bg-emerald-950/95 border-b border-emerald-800/60 px-3.5 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isHindi ? 'सलाहकार आवाज़ चुनें:' : 'Advisor Voice Persona:'}</span>
        </div>

        <div className="flex items-center bg-emerald-900/80 rounded-xl p-0.5 border border-emerald-700/60 text-[11px]">
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setVoicePersona('female');
            }}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              voicePersona === 'female'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm'
                : 'text-emerald-200 hover:text-white'
            }`}
            title={isHindi ? 'स्वाति - वरिष्ठ कृषि व्यापार सलाहकार (महिला स्वर)' : 'Swati - Senior Trade Advisor (Female voice)'}
          >
            <span>👩‍💼</span>
            <span>{isHindi ? 'स्वाति' : 'Swati'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setVoicePersona('male');
            }}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              voicePersona === 'male'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-sm'
                : 'text-emerald-200 hover:text-white'
            }`}
            title={isHindi ? 'रोहन - लॉजिस्टिक्स व व्यापार निदेशक (पुरुष स्वर)' : 'Rohan - Logistics & Trade Director (Male voice)'}
          >
            <span>👨‍💼</span>
            <span>{isHindi ? 'रोहन' : 'Rohan'}</span>
          </button>
        </div>
      </div>

      {/* Voice Listening Ripple Banner (when mic active) */}
      {isListening && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 flex items-center justify-between text-xs font-bold animate-pulse shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <Mic className="w-4 h-4" />
            <span>
              {isHindi
                ? 'व्यापार सलाहकार सुन रहे हैं... कृपया स्पष्ट बोलें...'
                : 'Advisor is listening... Please speak clearly...'}
            </span>
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="px-2 py-0.5 bg-slate-950 text-white rounded-md text-[10px] uppercase font-black"
          >
            {isHindi ? 'रोकें' : 'Stop'}
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/80">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSpeakingThis = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                  isUser
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                }`}
              >
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : voicePersona === 'female' ? (
                  '👩‍💼'
                ) : (
                  '👨‍💼'
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[84%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs relative group ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                }`}
              >
                {/* Text with executive formatting */}
                <div className="whitespace-pre-line font-medium space-y-1.5">
                  {msg.text.split('\n').map((paragraph, idx) => {
                    // Check if paragraph is an emoji-led section header
                    const isEmojiHeader =
                      /^[\p{Emoji}\p{Symbol}]/u.test(paragraph) &&
                      (paragraph.includes('**') || paragraph.includes(':') || paragraph.length < 50);

                    if (isEmojiHeader) {
                      return (
                        <p
                          key={idx}
                          className="font-extrabold text-[12.5px] text-emerald-950 border-b border-emerald-100 pb-1 mt-1 tracking-tight"
                        >
                          {paragraph.replace(/\*\*/g, '')}
                        </p>
                      );
                    }
                    if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
                      return (
                        <div key={idx} className="flex items-start gap-1.5 pl-1 text-slate-700">
                          <span className="text-emerald-700 font-bold shrink-0">•</span>
                          <span>{paragraph.slice(2).replace(/\*\*/g, '')}</span>
                        </div>
                      );
                    }
                    if (/^\d+\./.test(paragraph)) {
                      return (
                        <div key={idx} className="pl-1 text-slate-700 pt-0.5">
                          <span className="font-bold text-emerald-900">{paragraph.split(':')[0]}</span>
                          {paragraph.includes(':') && (
                            <span>:{paragraph.split(':').slice(1).join(':').replace(/\*\*/g, '')}</span>
                          )}
                        </div>
                      );
                    }
                    return <p key={idx}>{paragraph.replace(/\*\*/g, '')}</p>;
                  })}
                </div>

                {/* Footer: Timestamp & Read Aloud Button */}
                <div
                  className={`mt-2.5 pt-1.5 flex items-center justify-between gap-2 text-[10px] ${
                    isUser ? 'text-emerald-200 border-t border-emerald-700/50' : 'text-slate-400 border-t border-slate-100'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text, msg.id)}
                      className={`px-2 py-0.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSpeakingThis
                          ? 'bg-emerald-700 text-white font-bold animate-pulse shadow-xs'
                          : 'hover:bg-slate-100 text-slate-600 hover:text-emerald-800'
                      }`}
                      title={isSpeakingThis ? 'वाचन बंद करें / Stop audio' : 'व्यावसायिक स्वर में सुनें / Listen in executive voice'}
                    >
                      {isSpeakingThis ? (
                        <>
                          <VolumeX className="w-3 h-3 text-amber-300" />
                          <span className="text-[9.5px]">
                            {voicePersona === 'female'
                              ? isHindi
                                ? 'स्वाति बोल रही हैं...'
                                : 'Swati speaking...'
                              : isHindi
                              ? 'रोहन बोल रहे हैं...'
                              : 'Rohan speaking...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-700" />
                          <span className="text-[9.5px] font-semibold text-emerald-800">
                            {voicePersona === 'female'
                              ? isHindi
                                ? 'स्वाति से सुनें'
                                : 'Listen (Swati)'
                              : isHindi
                              ? 'रोहन से सुनें'
                              : 'Listen (Rohan)'}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-10">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] font-semibold text-emerald-900">
              {isHindi
                ? voicePersona === 'female'
                  ? 'स्वाति विश्लेषण कर रही हैं...'
                  : 'रोहन विश्लेषण कर रहे हैं...'
                : 'Consultant is analyzing...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-emerald-50/80 border-t border-emerald-100">
        <p className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isHindi ? 'व्यापारिक विषय (त्वरित चयन):' : 'Key Advisory Topics (Select):'}</span>
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {currentPrompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSendMessage(p.text)}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-100/90 text-emerald-950 border border-emerald-200 text-[11px] font-semibold transition-all shadow-2xs hover:scale-102 cursor-pointer flex items-center gap-1"
            >
              <span>{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar with Prominent Executive Voice Mic */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        {/* Prominent Voice Input Button */}
        <button
          type="button"
          onClick={toggleListening}
          className={`relative p-2.5 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 ${
            isListening
              ? 'bg-amber-500 text-slate-950 scale-105 shadow-lg ring-4 ring-amber-300/60 animate-bounce'
              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
          }`}
          title={
            isListening
              ? isHindi
                ? 'माइक बंद करें / Stop Listening'
                : 'Stop Listening'
              : isHindi
              ? 'व्यापार सलाहकार से बोलकर परामर्श लें (माइक दबाएं)'
              : 'Speak with Trade Advisor (Tap Mic)'
          }
        >
          {isListening ? (
            <Mic className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5 text-emerald-800" />
          )}

          {/* Subtle pulse indicator */}
          {!isListening && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
            </span>
          )}
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              isListening
                ? isHindi
                  ? 'सलाहकार सुन रहे हैं... बोलिए...'
                  : 'Listening... speak now...'
                : isHindi
                ? 'बोलकर या लिखकर पूछें (उदा. उपज का विपणन कैसे करें)...'
                : 'Speak or type query (e.g. cold-chain logistics)...'
            }
            className="w-full pl-3 pr-2 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputQuery.trim()}
          className="p-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs cursor-pointer shrink-0"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
