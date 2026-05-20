import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Globe, Settings, Bot, User, Sparkles, Trash2, 
  HelpCircle, Phone, ArrowLeft, Key, Info, ArrowUpRight, Sprout, X,
  ChevronLeft, ChevronRight, Volume2, VolumeX, Mic, MicOff, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";

// Define the route with TanStack router
export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "Signova AI — Multilingual Crop Assistant" },
      { name: "description", content: "Instant expert guidance on soil health, fertilizer programs, crop protection, and Signova micronutrient products in your local language." },
      { property: "og:title", content: "Signova AI" },
      { property: "og:description", content: "AI crop advisor supporting Hindi, Telugu, Gujarati, Marathi, Tamil, Kannada, and English." },
    ],
  }),
  component: AiChat,
});

type LanguageKey = "en" | "hi" | "te" | "gu" | "mr" | "ta" | "kn";

interface LanguageConfig {
  name: string;
  nativeName: string;
  welcome: string;
  placeholder: string;
  quickTitle: string;
  presets: string[];
  botName: string;
  onlineText: string;
  localModeLabel: string;
  geminiModeLabel: string;
  settingTitle: string;
  settingDesc: string;
  settingLabel: string;
  settingSave: string;
  clearChat: string;
  advisorPersona: string;
  headerTitle: string;
  headerSub: string;
  backHome: string;
  typingText: string;
}

const LOCALIZATION: Record<LanguageKey, LanguageConfig> = {
  en: {
    name: "English",
    nativeName: "English",
    welcome: "Hello! I am your Signova AI. How can I help you with your crops, soil nutrition, or Signova products today?",
    placeholder: "Ask about crops, products, or distributor...",
    quickTitle: "Quick Questions",
    presets: [
      "What is the best micronutrient for Cotton?",
      "How do I become a Signova distributor?",
      "Tell me about Nano Zinc Liquid.",
      "Crop nutrition schedule for Chilli."
    ],
    botName: "Signova AI",
    onlineText: "Active Advisor",
    localModeLabel: "Local Expert Database",
    geminiModeLabel: "Gemini AI Engine Active",
    settingTitle: "AgroAI Settings",
    settingDesc: "Configure the AI engine. Enter a Google Gemini API Key to enable general reasoning beyond our offline product database.",
    settingLabel: "Gemini API Key",
    settingSave: "Save Key & Connect",
    clearChat: "Clear Conversation",
    advisorPersona: "Signova AI",
    headerTitle: "Signova AI",
    headerSub: "Your digital crop consultant",
    backHome: "Back to Home",
    typingText: "Signova AI is typing..."
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    welcome: "नमस्कार! मैं आपका सिग्नोवा एआई हूँ। आज मैं आपकी फसलों, मिट्टी के पोषण, या सिग्नोवा उत्पादों में कैसे मदद कर सकता हूँ?",
    placeholder: "फसलों, उत्पादों या वितरक के बारे में पूछें...",
    quickTitle: "त्वरित प्रश्न",
    presets: [
      "कपास के लिए सबसे अच्छा सूक्ष्म पोषक तत्व क्या है?",
      "मैं सिग्नोवा वितरक कैसे बन सकता हूँ?",
      "नैनो जिंक लिक्विड के बारे में बताएं।",
      "मिर्च के लिए फसल पोषण कार्यक्रम।"
    ],
    botName: "सिग्नोवा एआई",
    onlineText: "सक्रिय सलाहकार",
    localModeLabel: "स्थानीय विशेषज्ञ डेटाबेस",
    geminiModeLabel: "जेमिनी एआई सक्रिय",
    settingTitle: "एग्रोएआई सेटिंग्स",
    settingDesc: "एआई इंजन कॉन्फ़िगर करें। हमारे ऑफ़लाइन उत्पाद डेटाबेस से परे सामान्य कृषि संबंधी सलाह के लिए जेमिनी एपीआई की दर्ज करें।",
    settingLabel: "जेमिनी एपीआई की (API Key)",
    settingSave: "कुंजी सहेजें और कनेक्ट करें",
    clearChat: "चैट इतिहास मिटाएं",
    advisorPersona: "सिग्नोवा एआई",
    headerTitle: "सिग्नोवा एआई",
    headerSub: "आपका डिजिटल फसल विशेषज्ञ",
    backHome: "मुख्य पृष्ठ पर जाएं",
    typingText: "सिग्नोवा एआई लिख रहा है..."
  },
  te: {
    name: "Telugu",
    nativeName: "తెలుగు",
    welcome: "నమస్కారం! నేను మీ సిగ్నోవా AI. ఈ రోజు మీ పంటలు, నేల పోషణ లేదా సిగ్నోవా ఉత్పత్తుల గురించి నేను మీకు ఎలా సహాయపడగలను?",
    placeholder: "పంటలు, ఉత్పత్తులు లేదా డిస్ట్రిబ్యూటర్ల గురించి అడగండి...",
    quickTitle: "త్వరిత ప్రశ్నలు",
    presets: [
      "పత్తి పంటకు ఉత్తమమైన మైక్రోన్యూట్రియెంట్ ఏది?",
      "నేను సిగ్నోవా డిస్ట్రిబ్యూటర్ ఎలా అవ్వాలి?",
      "నానో జింక్ లిక్విడ్ గురించి చెప్పండి.",
      "మిరప పంటకు పోషక ప్రణాళిక."
    ],
    botName: "సిగ్నోవా AI",
    onlineText: "క్రియాశీల సలహాదారు",
    localModeLabel: "లోకల్ ఎక్స్‌పర్ట్ డేటాబేస్",
    geminiModeLabel: "జెమిని AI క్రియాశీలం",
    settingTitle: "AgroAI సెట్టింగులు",
    settingDesc: "AI ఇంజిన్‌ను కాన్ఫిగర్ చేయండి. సాధారణ వ్యవసాయ సలహాల కోసం మీ గూగుల్ జెమిని API కీని నమోదు చేయండి.",
    settingLabel: "జెమిని API కీ",
    settingSave: "కీని సేవ్ చేయి & కనెక్ట్ చేయి",
    clearChat: "చాట్ క్లియర్ చేయి",
    advisorPersona: "సిగ్నోవా AI",
    headerTitle: "సిగ్నోవా AI",
    headerSub: "మీ డిజిటల్ పంట నిపుణుడు",
    backHome: "హోమ్ పేజీకి వెళ్ళు",
    typingText: "సిగ్నోవా AI టైప్ చేస్తోంది..."
  },
  gu: {
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    welcome: "નમસ્તે! હું તમારો સિગ્નોવા AI છું. આજે હું તમને તમારા પાક, જમીનના પોષણ અથવા સિગ્નોવા ઉત્પાદનો વિશે કેવી રીતે મદદ કરી શકું?",
    placeholder: "પાક, ઉત્પાદનો અથવા ડિસ્ટ્રિબ્યુટર વિશે પૂછો...",
    quickTitle: "ઝડપી પ્રશ્નો",
    presets: [
      "કપાસ માટે શ્રેષ્ઠ માઇક્રોન્યુટ્રિએન્ટ કયું છે?",
      "હું સિગ્નોવા ડિસ્ટ્રિબ્યુટર કેવી રીતે બની શકું?",
      "નેનો ઝિંક લિક્વિડ વિશે જણાવો.",
      "મરચાં માટે પાક પોષણ સમયપત્રક."
    ],
    botName: "સિગ્નોવા AI",
    onlineText: "સક્રિય સલાહકાર",
    localModeLabel: "સ્થાનિક નિષ્ણાત ડેટાબેઝ",
    geminiModeLabel: "જેમિની AI સક્રિય",
    settingTitle: "AgroAI સેટિંગ્સ",
    settingDesc: "AI એન્જિન ગોઠવો. સામાન્ય કૃષિ સલાહ માટે તમારી ગુગલ જેમિની API કી દાખલ કરો.",
    settingLabel: "જેમિની API કી",
    settingSave: "કી સાચવો અને જોડાઓ",
    clearChat: "વાતચીત ભૂંસી નાખો",
    advisorPersona: "સિગ્નોવા AI",
    headerTitle: "સિગ્નોવા AI",
    headerSub: "તમારા ડિજિટલ પાક સલાહકાર",
    backHome: "હોમ પર પાછા જાઓ",
    typingText: "સિગ્નોવા AI લખી રહ્યું છે..."
  },
  mr: {
    name: "Marathi",
    nativeName: "मराठी",
    welcome: "नमस्कार! मी तुमचा सिग्नोवा AI आहे. आज मी तुम्हाला तुमची पिके, जमिनीचे पोषण किंवा सिग्नोवा उत्पादनांबद्दल कशी मदत करू शकतो?",
    placeholder: "पिके, उत्पादने किंवा वितरकाबद्दल विचारा...",
    quickTitle: "त्वरित प्रश्न",
    presets: [
      "कापसासाठी सर्वोत्तम सूक्ष्म पोषक घटक कोणते आहे?",
      "मी सिग्नोवा वितरक कसा बनू शकतो?",
      "नॅनो झिंक लिक्विड बद्दल सांगा.",
      "मिरचीसाठी पीक पोषण वेळापत्रक."
    ],
    botName: "सिग्नोवा AI",
    onlineText: "सक्रिय सल्लागार",
    localModeLabel: "स्थानिक तज्ज्ञ डेटाबेस",
    geminiModeLabel: "जेमिनी AI सक्रिय",
    settingTitle: "AgroAI सेटिंग्स",
    settingDesc: "AI इंजिन कॉन्फिगर करा. सामान्य कृषी सल्ल्यासाठी जेमिनी API की प्रविष्ट करा.",
    settingLabel: "जेमिनी API की",
    settingSave: "की जतन करा आणि कनेक्ट करा",
    clearChat: "चॅट साफ करा",
    advisorPersona: "सिग्नोवा AI",
    headerTitle: "सिग्नोवा AI",
    headerSub: "तुमचा डिजिटल पीक सल्लागार",
    backHome: "मुख्यपृष्ठावर जा",
    typingText: "सिग्नोवा AI टाईप करत आहे..."
  },
  ta: {
    name: "Tamil",
    nativeName: "தமிழ்",
    welcome: "வணக்கம்! நான் உங்கள் சிக்னோவா AI. இன்று உங்கள் பயிர்கள், மண் ஊட்டச்சத்து அல்லது சிக்னோவா தயாரிப்புகள் குறித்து நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
    placeholder: "பயிர்கள், தயாரிப்புகள் அல்லது விநியோகஸ்தர் பற்றி கேளுங்கள்...",
    quickTitle: "விரைவான கேள்விகள்",
    presets: [
      "பருத்திக்கு சிறந்த நுண்ஊட்டச்சத்து எது?",
      "நான் எப்படி சிக்னோவா விநியோகஸ்தர் ஆவது?",
      "நானோ துத்தநாக திரவம் பற்றி சொல்லுங்கள்.",
      "மிளகாய்க்கான பயிர் ஊட்டச்சத்து அட்டவணை."
    ],
    botName: "சிக்னோவா AI",
    onlineText: "செயலில் உள்ள ஆலோசகர்",
    localModeLabel: "உள்ளூர் நிபுணர் தரவுத்தளம்",
    geminiModeLabel: "ஜெமினி AI செயல்படுகிறது",
    settingTitle: "AgroAI அமைப்புகள்",
    settingDesc: "AI எஞ்சினை உள்ளமைக்கவும். பொதுவான விவசாய ஆலோசனை பெற ஜெமினி API கீயை உள்ளிடவும்.",
    settingLabel: "ஜெமினி API கீ",
    settingSave: "சேமித்து இணைக்கவும்",
    clearChat: "உரையாடலை அழிக்கவும்",
    advisorPersona: "சிக்னோவா AI",
    headerTitle: "சிக்னோவா AI",
    headerSub: "உங்கள் டிஜிட்டல் பயிர் ஆலோசகர்",
    backHome: "முகப்புக்குச் செல்லவும்",
    typingText: "சிக்னோவா AI தட்டச்சு செய்கிறார்..."
  },
  kn: {
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಿಗ್ನೋವಾ AI. ಇಂದು ನಿಮ್ಮ ಬೆಳೆಗಳು, ಮಣ್ಣಿನ ಪೋಷಣೆ ಅಥವಾ ಸಿಗ್ನೋವಾ ಉತ್ಪನ್ನಗಳ ಬಗ್ಗೆ ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    placeholder: "ಬೆಳೆಗಳು, ಉತ್ಪನ್ನಗಳು ಅಥವಾ ವಿತರಕರ ಬಗ್ಗೆ ಕೇಳಿ...",
    quickTitle: "ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು",
    presets: [
      "ಹತ್ತಿ ಬೆಳೆಗೆ ಅತ್ಯುತ್ತಮ ಮೈಕ್ರೋನ್ಯೂಟ್ರಿಯೆಂಟ್ ಯಾವುದು?",
      "ನಾನು ಸಿಗ್ನೋವಾ ವಿತರಕನಾಗುವುದು ಹೇಗೆ?",
      "ನ್ಯಾನೋ ಜಿಂಕ್ ಲಿಕ್ವಿಡ್ ಬಗ್ಗೆ ತಿಳಿಸಿ.",
      "ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆ ಪೋಷಣೆ ವೇಳಾಪಟ್ಟಿ."
    ],
    botName: "ಸಿಗ್ನೋವಾ AI",
    onlineText: "ಸಕ್ರಿಯ ಸಲಹೆಗಾರ",
    localModeLabel: "ಸ್ಥಳೀಯ ತಜ್ಞರ ಡೇಟಾಬೇಸ್",
    geminiModeLabel: "ಜೆಮಿನಿ AI ಸಕ್ರಿಯವಾಗಿದೆ",
    settingTitle: "AgroAI ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    settingDesc: "AI ಇಂಜಿನ್ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ. ವಿವರವಾದ ಕೃಷಿ ಸಲಹೆಗಳಿಗಾಗಿ ಗೂಗಲ್ ಜೆಮಿನಿ API ಕೀಲಿಯನ್ನು ನಮೂದಿಸಿ.",
    settingLabel: "ಜೆಮಿನಿ API ಕೀಲಿ",
    settingSave: "ಉಳಿಸಿ ಮತ್ತು ಸಂಪರ್ಕಿಸಿ",
    clearChat: "ಚಾಟ್ ಸಂಭಾಷಣೆ ಅಳಿಸಿ",
    advisorPersona: "ಸಿಗ್ನೋವಾ AI",
    headerTitle: "ಸಿಗ್ನೋವಾ AI",
    headerSub: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಬೆಳೆ ತಜ್ಞ",
    backHome: "ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    typingText: "ಸಿಗ್ನೋವಾ AI ಟೈಪ್ ಮಾಡುತ್ತಿದ್ದಾರೆ..."
  }
};

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isRichHtml?: boolean;
}

export function AiChat({ isModal = false, onClose }: { isModal?: boolean; onClose?: () => void } = {}) {
  const [lang, setLang] = useState<LanguageKey>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("AIzaSyAwHAhjR_Et0XhbBQ3yxJh2MtWvlxqmE5o");
  const [useGemini, setUseGemini] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Voice & Interaction states
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem("signova_chat_muted");
    if (saved !== null) {
      return saved === "true";
    }
    try {
      const local = localStorage.getItem("signova_frontend_settings");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.theme && parsed.theme.muteSpeechByDefault !== undefined) {
          return parsed.theme.muteSpeechByDefault === true;
        }
      }
    } catch (e) {}
    return true; // Default to true (disabled)
  });
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    async function fetchSpeechSettings() {
      if (localStorage.getItem("signova_chat_muted") !== null) return;
      try {
        const { data, error } = await supabase
          .from("frontend_settings")
          .select("*")
          .eq("key", "theme")
          .single();

        if (!error && data && data.value && data.value.muteSpeechByDefault !== undefined) {
          setIsMuted(data.value.muteSpeechByDefault === true);
        }
      } catch (err) {
        console.warn("Failed to fetch brand speech settings", err);
      }
    }
    fetchSpeechSettings();
  }, []);

  // Modal Resizing States & Handlers
  const [modalSize, setModalSize] = useState(() => {
    try {
      const saved = localStorage.getItem("signova_chat_modal_size");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          width: Math.max(320, Math.min(800, parsed.width)),
          height: Math.max(400, Math.min(1000, parsed.height))
        };
      }
    } catch (e) {}
    // Default to 400px width and 60% of viewport height on desktop
    const defaultWidth = 400;
    const defaultHeight = typeof window !== "undefined" ? Math.max(450, Math.round(window.innerHeight * 0.60)) : 600;
    return { width: defaultWidth, height: defaultHeight };
  });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 640);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const startResize = (e: React.MouseEvent, direction: "w" | "n" | "nw") => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = modalSize.width;
    const startHeight = modalSize.height;

    const doResize = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === "w" || direction === "nw") {
        // Left drag changes width (since the right side is fixed)
        const deltaX = startX - moveEvent.clientX;
        newWidth = Math.max(320, Math.min(window.innerWidth - 48, startWidth + deltaX));
      }

      if (direction === "n" || direction === "nw") {
        // Top drag changes height (since the bottom side is fixed)
        const deltaY = startY - moveEvent.clientY;
        newHeight = Math.max(400, Math.min(window.innerHeight - 120, startHeight + deltaY));
      }

      setModalSize({ width: newWidth, height: newHeight });
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", doResize);
      document.removeEventListener("mouseup", stopResize);
      setModalSize(prev => {
        localStorage.setItem("signova_chat_modal_size", JSON.stringify(prev));
        return prev;
      });
    };

    document.addEventListener("mousemove", doResize);
    document.addEventListener("mouseup", stopResize);
  };

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const langBarRef = useRef<HTMLDivElement>(null);
  const presetsBarRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const t = LOCALIZATION[lang];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<any>(null);

  // Initialize entry sound effect
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
    audioRef.current.load();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Speech Recognition when language changes
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      const langLocaleMap: Record<LanguageKey, string> = {
        en: "en-US",
        hi: "hi-IN",
        te: "te-IN",
        gu: "gu-IN",
        mr: "mr-IN",
        ta: "ta-IN",
        kn: "kn-IN"
      };
      rec.lang = langLocaleMap[lang] || "en-US";

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      
      recognitionRef.current = rec;
    }
  }, [lang]);

  // Text-To-Speech function
  const speakText = (text: string, voiceLang: string) => {
    if (isMuted || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();

    // Clean up HTML tags and markdown symbols
    const cleanText = text
      .replace(/<[^>]*>/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[*_#`~>]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang || "en-US";

    const getOptimalVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return null;
      
      const langPrefix = utterance.lang.split("-")[0];
      const matchVoices = voices.filter(v => v.lang.startsWith(langPrefix));
      
      if (matchVoices.length > 0) {
        return matchVoices.sort((a, b) => {
          const score = (voice: typeof a) => {
            let pts = 0;
            const name = voice.name.toLowerCase();
            if (name.includes("google") || name.includes("premium") || name.includes("natural")) pts += 10;
            if (name.includes("female") || name.includes("vani") || name.includes("heera")) pts += 5;
            return pts;
          };
          return score(b) - score(a);
        })[0];
      }
      return voices.find(v => v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("female")) || voices[0];
    };

    const runSpeak = () => {
      const voice = getOptimalVoice();
      if (voice) utterance.voice = voice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        runSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      runSpeak();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening... Speak now");
    }
  };

  const toggleMuted = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("signova_chat_muted", String(nextMuted));
    if (nextMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      toast.info("Voice replies enabled");
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const [canScrollPresetsLeft, setCanScrollPresetsLeft] = useState(false);
  const [canScrollPresetsRight, setCanScrollPresetsRight] = useState(false);

  const checkScrollState = () => {
    const el = langBarRef.current;
    if (el) {
      const canScrollL = el.scrollLeft > 1;
      const canScrollR = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
      setCanScrollLeft(canScrollL);
      setCanScrollRight(canScrollR);
    }
  };

  const checkPresetsScrollState = () => {
    const el = presetsBarRef.current;
    if (el) {
      const canScrollL = el.scrollLeft > 1;
      const canScrollR = el.scrollWidth - el.clientWidth - el.scrollLeft > 1;
      setCanScrollPresetsLeft(canScrollL);
      setCanScrollPresetsRight(canScrollR);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScrollState, 150);
    window.addEventListener("resize", checkScrollState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScrollState);
    };
  }, [lang, modalSize]);

  useEffect(() => {
    const timer = setTimeout(checkPresetsScrollState, 150);
    window.addEventListener("resize", checkPresetsScrollState);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkPresetsScrollState);
    };
  }, [messages, lang, modalSize]);

  const scrollLangBar = (direction: "left" | "right") => {
    if (langBarRef.current) {
      const scrollAmount = 160;
      langBarRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(checkScrollState, 350);
    }
  };

  const scrollPresetsBar = (direction: "left" | "right") => {
    if (presetsBarRef.current) {
      const scrollAmount = 160;
      presetsBarRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(checkPresetsScrollState, 350);
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("signova_chat_lang") as LanguageKey;
    if (savedLang && LOCALIZATION[savedLang]) {
      setLang(savedLang);
    }
    
    const savedKey = localStorage.getItem("signova_gemini_api_key");
    if (savedKey !== null) {
      if (savedKey) {
        setApiKey(savedKey);
        setUseGemini(true);
      } else {
        setApiKey("");
        setUseGemini(false);
      }
    } else {
      setApiKey("AIzaSyAwHAhjR_Et0XhbBQ3yxJh2MtWvlxqmE5o");
      setUseGemini(true);
    }

    const savedHistory = localStorage.getItem("signova_chat_history");
    if (savedHistory) {
      try {
        setMessages(JSON.parse(savedHistory));
      } catch (e) {
        initializeWelcomeMessage(savedLang || "en");
      }
    } else {
      initializeWelcomeMessage(savedLang || "en");
    }
  }, []);

  useEffect(() => {
    const handleGlobalLangChange = () => {
      const savedLang = localStorage.getItem("signova_chat_lang") as LanguageKey;
      if (savedLang && LOCALIZATION[savedLang] && savedLang !== lang) {
        setLang(savedLang);
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const greeting = LOCALIZATION[savedLang]?.welcome || LOCALIZATION.en.welcome;
        setMessages([{ sender: "bot", text: greeting, timestamp: time }]);
      }
    };
    window.addEventListener("signova_language_changed", handleGlobalLangChange);
    return () => window.removeEventListener("signova_language_changed", handleGlobalLangChange);
  }, [lang]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("signova_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const initializeWelcomeMessage = (selectedLang: LanguageKey) => {
    const greeting = LOCALIZATION[selectedLang]?.welcome || LOCALIZATION.en.welcome;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages([{ sender: "bot", text: greeting, timestamp: time }]);
  };

  const handleLangChange = (newLang: LanguageKey) => {
    setLang(newLang);
    localStorage.setItem("signova_chat_lang", newLang);
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const greeting = LOCALIZATION[newLang]?.welcome || LOCALIZATION.en.welcome;
    setMessages([{ sender: "bot", text: greeting, timestamp: time }]);
    toast.success(`Language changed to ${LOCALIZATION[newLang].name}`);
    window.dispatchEvent(new Event("signova_language_changed"));
  };

  const clearChat = () => {
    localStorage.removeItem("signova_chat_history");
    initializeWelcomeMessage(lang);
    toast.success("Chat history cleared.");
  };

  const handleSaveApiKey = (key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem("signova_gemini_api_key", trimmed);
      setApiKey(trimmed);
      setUseGemini(true);
      toast.success("Gemini API Key connected successfully!");
    } else {
      localStorage.removeItem("signova_gemini_api_key");
      setApiKey("");
      setUseGemini(false);
      toast.info("Switched to Local Expert Database mode.");
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      if (isFirstRender.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        isFirstRender.current = false;
      } else {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    if (!textToSend) {
      setInput("");
    }

    // Cancel speech synthesis when user interacts/sends a new prompt
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { sender: "user", text: prompt, timestamp: time };
    
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setIsTyping(true);

    setTimeout(async () => {
      try {
        let replyText = "";
        let isRich = false;
        
        if (useGemini && apiKey) {
          const rawReply = await fetchGeminiResponse(prompt, lang, apiKey);
          replyText = formatMarkdownToHtml(rawReply);
          isRich = true;
        } else {
          replyText = getLocalAgroResponse(prompt, lang);
          isRich = true;
        }

        const botMsg: Message = {
          sender: "bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isRichHtml: isRich
        };
        setMessages((prev) => [...prev, botMsg]);

        // Play entry sound effect if not muted
        if (!isMuted && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.warn("Audio play failed:", err));
        }

        // Speak the reply
        const localeMap: Record<LanguageKey, string> = {
          en: "en-US",
          hi: "hi-IN",
          te: "te-IN",
          gu: "gu-IN",
          mr: "mr-IN",
          ta: "ta-IN",
          kn: "kn-IN"
        };
        speakText(replyText, localeMap[lang] || "en-US");

      } catch (err) {
        toast.error("Failed to generate AI response. Using local fallback.");
        const fallbackText = getLocalAgroResponse(prompt, lang);
        const botMsg: Message = {
          sender: "bot",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isRichHtml: true
        };
        setMessages((prev) => [...prev, botMsg]);

        if (!isMuted && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => console.warn("Audio play failed:", err));
        }
        const localeMap: Record<LanguageKey, string> = {
          en: "en-US",
          hi: "hi-IN",
          te: "te-IN",
          gu: "gu-IN",
          mr: "mr-IN",
          ta: "ta-IN",
          kn: "kn-IN"
        };
        speakText(fallbackText, localeMap[lang] || "en-US");
      } finally {
        setIsTyping(false);
      }
    }, 1200);
  };

  const renderChatCard = () => {
    return (
      <Card className={isModal ? "border-0 bg-transparent rounded-none flex-1 flex flex-col overflow-hidden h-full min-h-0" : "glass-panel shadow-card border-none rounded-3xl flex-1 flex flex-col overflow-hidden h-full min-h-0"}>
        
        {/* Chat Card Header */}
        <div className="p-4 sm:p-5 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {/* Glowing Avatar */}
            <div className="relative shrink-0 select-none">
              {/* Outer rotating gradient ring */}
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-primary via-primary dark:via-lime to-emerald-500 opacity-80 blur-[2px] animate-spin-slow" />
              {/* Inner container */}
              <div className="relative size-10 rounded-xl bg-charcoal p-1.5 flex items-center justify-center border border-white/10 z-10">
                <img src="/favicon.ico" alt="Signova Logo" className="size-full object-contain" />
              </div>
              {/* Multi-layered status ping */}
              <span className="absolute -bottom-1 -right-1 z-20 flex size-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 scale-150 [animation-delay:0.2s]" />
                <span className="relative inline-flex rounded-full size-3 bg-emerald-500 border border-background shadow-xs" />
              </span>
            </div>
            
            <div>
              <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  {t.headerTitle}
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {t.headerSub}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Voice Mute / Unmute Button */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleMuted}
              className={`h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:bg-secondary/40 transition-all cursor-pointer ${
                !isMuted ? "text-primary dark:text-lime border-primary/30 dark:border-lime/30 bg-primary/5 dark:bg-lime/5" : ""
              }`}
              title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
            >
              {isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className={`size-4 ${isSpeaking ? "animate-bounce" : ""}`} />
              )}
            </Button>

            {/* Clear Chat Button */}
            <Button 
              size="icon" 
              variant="outline" 
              onClick={clearChat} 
              className="h-8.5 w-8.5 rounded-xl border border-border/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all cursor-pointer group" 
              title="Clear Chat History"
            >
              <Trash2 className="size-4 group-hover:scale-110 transition-transform duration-200" />
            </Button>

            {/* Close Button */}
            {isModal ? (
              <Button 
                size="icon" 
                variant="outline" 
                onClick={onClose} 
                className="h-8.5 w-8.5 rounded-xl border border-border/80 text-foreground/80 hover:bg-secondary/40 hover:text-white transition-all cursor-pointer group"
                title="Close Chat"
              >
                <X className="size-4 group-hover:scale-110 transition-transform" />
              </Button>
            ) : (
              <Link 
                to="/" 
                className="h-8.5 w-8.5 rounded-xl shadow-xs border border-border/80 text-foreground/80 hover:bg-secondary/40 grid place-items-center transition-all hover:text-white cursor-pointer group"
                title="Exit / Close"
              >
                <X className="size-4 group-hover:scale-110 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Scrollable Language Bar Container with Navigation Arrows */}
        <div className={`relative border-b border-border/40 bg-muted/20 flex items-center shrink-0 group ${isModal ? "" : "lg:hidden"}`}>
          {/* Left Arrow with Fade Overlay */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background dark:from-[#0a0a0a] via-background/85 dark:via-[#0a0a0a]/85 to-transparent z-10 flex items-center pl-2 pointer-events-none">
              <button 
                type="button"
                onClick={() => scrollLangBar("left")}
                className="size-8 rounded-full bg-background dark:bg-[#121212] border border-border hover:border-primary hover:text-primary shadow-md flex items-center justify-center text-foreground transition-all cursor-pointer pointer-events-auto active:scale-95"
                aria-label="Scroll Languages Left"
              >
                <ChevronLeft className="size-5" />
              </button>
            </div>
          )}

          {/* Scrollable Language Bar */}
          <div 
            ref={langBarRef}
            onScroll={checkScrollState}
            className={`flex overflow-x-auto gap-2 py-3 scrollbar-none shrink-0 w-full scroll-smooth transition-all ${
              (canScrollLeft || canScrollRight) ? "px-9" : "px-4 justify-center"
            }`}
          >
            {(Object.keys(LOCALIZATION) as LanguageKey[]).map((key) => {
              const active = lang === key;
              const langConfig = LOCALIZATION[key];
              return (
                <button
                  key={key}
                  onClick={() => handleLangChange(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer select-none active:scale-95 shadow-xs ${
                    active 
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(132,204,22,0.25)] scale-[1.02]" 
                      : "bg-deep/10 dark:bg-black/50 text-deep dark:text-foreground border-deep/20 dark:border-border/80 hover:bg-deep/20 hover:border-primary hover:text-deep dark:hover:text-primary-foreground"
                  }`}
                >
                  <span>{langConfig.nativeName}</span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow with Fade Overlay */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background dark:from-[#0a0a0a] via-background/85 dark:via-[#0a0a0a]/85 to-transparent z-10 flex items-center justify-end pr-2 pointer-events-none">
              <button 
                type="button"
                onClick={() => scrollLangBar("right")}
                className="size-8 rounded-full bg-background dark:bg-[#121212] border border-border hover:border-primary hover:text-primary shadow-md flex items-center justify-center text-foreground transition-all cursor-pointer pointer-events-auto active:scale-95"
                aria-label="Scroll Languages Right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>

        {/* Messages view */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pl-5 pr-2.5 py-5 sm:pl-6 sm:pr-3.5 sm:py-6 space-y-4 chat-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isBot = msg.sender === "bot";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse ml-auto"}`}
                >
                  <div className={`size-8.5 rounded-xl grid place-items-center shrink-0 shadow-sm relative ${
                    isBot ? "bg-lime-gradient text-charcoal flex items-center justify-center p-1.5" : "bg-charcoal text-white border border-white/10"
                  }`}>
                    {isBot ? <img src="/favicon.ico" alt="Signova Logo" className="size-full object-contain" /> : <User className="size-4" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl leading-relaxed text-sm shadow-sm ${
                      isBot 
                        ? "message-glass border border-border/40 text-foreground" 
                        : "bg-primary text-primary-foreground font-medium rounded-tr-none border border-primary/20"
                    }`}>
                      {msg.isRichHtml ? (
                        <div 
                          className="space-y-2 rich-chat-content"
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                      ) : (
                        <p className="whitespace-pre-line">{msg.text}</p>
                      )}
                    </div>
                    
                    <div className={`text-[10px] text-muted-foreground px-1 ${!isBot ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="size-8.5 rounded-xl bg-lime-gradient p-1.5 grid place-items-center shrink-0">
                <img src="/favicon.ico" alt="Signova Logo" className="size-full object-contain animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="p-3.5 rounded-2xl message-glass border border-border/40 text-foreground flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs font-semibold">Signova AI Thinking</span>
                  <div className="flex gap-1 items-center">
                    <span className="size-1.5 bg-leaf rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1.5 bg-leaf rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1.5 bg-leaf rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preset suggestions + Inputs */}
        <div className="p-4 sm:p-5 border-t border-border/40 bg-gradient-to-t from-primary/5 via-transparent to-transparent space-y-4">
          
          {messages.length <= 1 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-deep dark:text-leaf select-none">
                {t.quickTitle}
              </span>
              <div className="relative flex items-center group/presets">
                {/* Left Arrow with Fade Overlay */}
                {canScrollPresetsLeft && (
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background dark:from-[#0a0a0a] via-background/85 dark:via-[#0a0a0a]/85 to-transparent z-10 flex items-center pl-1 pointer-events-none">
                    <button 
                      type="button"
                      onClick={() => scrollPresetsBar("left")}
                      className="size-7 rounded-full bg-background dark:bg-[#121212] border border-border hover:border-primary hover:text-primary shadow-xs flex items-center justify-center text-foreground transition-all cursor-pointer pointer-events-auto active:scale-95"
                      aria-label="Scroll Presets Left"
                    >
                      <ChevronLeft className="size-4.5" />
                    </button>
                  </div>
                )}

                {/* Scrollable Presets list */}
                <div 
                  ref={presetsBarRef}
                  onScroll={checkPresetsScrollState}
                  className={`flex overflow-x-auto gap-2 pb-1.5 scrollbar-none scroll-smooth w-full select-none ${
                    (canScrollPresetsLeft || canScrollPresetsRight) ? "px-8" : ""
                  }`}
                >
                  {t.presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(preset)}
                      className="px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap rounded-xl bg-deep/10 dark:bg-black/35 text-deep dark:text-foreground hover:bg-primary hover:text-primary-foreground border border-deep/20 dark:border-border/80 hover:border-primary transition-all flex items-center gap-1 cursor-pointer active:scale-[0.97]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Right Arrow with Fade Overlay */}
                {canScrollPresetsRight && (
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background dark:from-[#0a0a0a] via-background/85 dark:via-[#0a0a0a]/85 to-transparent z-10 flex items-center justify-end pr-1 pointer-events-none">
                    <button 
                      type="button"
                      onClick={() => scrollPresetsBar("right")}
                      className="size-7 rounded-full bg-background dark:bg-[#121212] border border-border hover:border-primary hover:text-primary shadow-xs flex items-center justify-center text-foreground transition-all cursor-pointer pointer-events-auto active:scale-95"
                      aria-label="Scroll Presets Right"
                    >
                      <ChevronRight className="size-4.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 relative group items-center"
            >
              <div className="relative flex-1">
                {/* Neon focus glow background ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/20 dark:to-lime/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                
                {/* Input element */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="relative w-full bg-background/60 dark:bg-black/35 border border-border/80 focus-visible:ring-0 focus-visible:border-primary pr-28 pl-4 rounded-2xl text-sm sm:text-base h-12 shadow-sm text-foreground"
                />

                {/* Inline Action Buttons */}
                <div className="absolute right-2 top-2 flex items-center gap-1 z-20">
                  {/* Mic Dictation Button */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleListening}
                    className={`h-8 w-8 rounded-xl hover:bg-secondary/40 text-muted-foreground transition-all ${
                      isListening ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 animate-pulse" : ""
                    }`}
                    title={isListening ? "Stop listening" : "Dictate message"}
                  >
                    {isListening ? (
                      <MicOff className="size-4" />
                    ) : (
                      <Mic className="size-4" />
                    )}
                  </Button>

                  {/* Send Button */}
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-8 w-8 bg-lime-gradient hover:opacity-90 active:scale-95 text-charcoal rounded-xl shadow-sm border-none cursor-pointer"
                    aria-label="Send Message"
                  >
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </div>
            </form>
            <div className="text-center mt-2.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 select-none">
                Powered by Signova AI
              </span>
            </div>
          </div>
        </div>

      </Card>
    );
  };

  if (isModal) {
    return (
      <>
        {/* Full-screen Backdrop Overlay with exit transition support */}
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          onClick={onClose}
          className="fixed inset-0 z-[49] bg-black/25 pointer-events-auto"
        />

        {/* Floating Modal Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-1/2 -translate-x-1/2 bottom-6 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-24 z-50 w-[calc(100vw-32px)] sm:w-[400px] max-w-[420px] sm:max-w-none h-[78dvh] sm:h-[600px] sm:max-h-[calc(100vh-120px)] flex flex-col rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden glass-panel select-none pointer-events-auto"
          style={isDesktop ? { width: `${modalSize.width}px`, height: `${modalSize.height}px` } : undefined}
        >
          {/* Resize Handles (Desktop Only) */}
          {isDesktop && (
            <>
              {/* Left Edge resize handle */}
              <div
                onMouseDown={(e) => startResize(e, "w")}
                className="absolute left-0 top-3 bottom-3 w-1.5 cursor-w-resize z-50 group flex items-center justify-center"
                title="Drag to resize width"
              >
                <div className="w-[2px] h-10 bg-foreground/10 group-hover:bg-primary/40 rounded-full transition-colors" />
              </div>
              
              {/* Top Edge resize handle */}
              <div
                onMouseDown={(e) => startResize(e, "n")}
                className="absolute top-0 left-3 right-3 h-1.5 cursor-n-resize z-50 group flex items-center justify-center"
                title="Drag to resize height"
              >
                <div className="h-[2px] w-10 bg-foreground/10 group-hover:bg-primary/40 rounded-full transition-colors" />
              </div>
              
              {/* Top-Left Corner resize handle */}
              <div
                onMouseDown={(e) => startResize(e, "nw")}
                className="absolute top-0 left-0 size-4 cursor-nw-resize z-50 rounded-tl-3xl hover:bg-primary/10 transition-colors"
                title="Drag to resize"
              />
            </>
          )}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes spin-slow {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 8s linear infinite;
            }
            .glass-panel {
              background: rgba(255, 255, 255, 0.90);
              backdrop-filter: blur(40px) saturate(200%);
              -webkit-backdrop-filter: blur(40px) saturate(200%);
              border: 1px solid rgba(9, 9, 11, 0.09);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            }
            .dark .glass-panel {
              background: rgba(10, 10, 10, 0.75);
              backdrop-filter: blur(40px) saturate(200%);
              -webkit-backdrop-filter: blur(40px) saturate(200%);
              border: 1px solid rgba(255, 255, 255, 0.08);
            }
            .message-glass {
              background: rgba(244, 244, 245, 0.92);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(9, 9, 11, 0.06);
            }
            .dark .message-glass {
              background: rgba(255, 255, 255, 0.06);
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.08);
            }
            .rich-chat-content span.bg-lime {
              background-color: var(--primary) !important;
            }
            .dark .rich-chat-content span.bg-lime {
              background-color: oklch(0.82 0.21 128) !important;
            }
            .chat-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .chat-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .chat-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.1);
              border-radius: 99px;
            }
            .dark .chat-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 99px;
            }
            .chat-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.2);
            }
            .dark .chat-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            .rich-chat-content h3 { font-size: 0.95rem !important; font-weight: 700 !important; color: var(--primary) !important; margin-bottom: 0.5rem !important; margin-top: 0.25rem !important; display: flex !important; align-items: center !important; gap: 0.375rem !important; }
            .dark .rich-chat-content h3 { color: oklch(0.82 0.21 128) !important; }
            .rich-chat-content p { font-size: 0.875rem !important; line-height: 1.55 !important; color: inherit !important; opacity: 0.95 !important; margin-bottom: 0.625rem !important; }
            .rich-chat-content ul { font-size: 0.875rem !important; line-height: 1.55 !important; color: inherit !important; opacity: 0.92 !important; margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
            .rich-chat-content li { margin-bottom: 0.35rem !important; }
            .rich-chat-content div { font-size: 0.775rem !important; line-height: 1.45 !important; margin-top: 0.75rem !important; padding: 0.75rem !important; border-radius: 0.75rem !important; background-color: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.08) !important; color: inherit !important; }
            .scrollbar-none::-webkit-scrollbar { display: none !important; }
            .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
          `}} />
          {renderChatCard()}
        </motion.div>
      </>
    );
  }

  return (
    <div className="h-[calc(100dvh)] lg:h-screen bg-background relative pt-20 lg:pt-28 pb-4 lg:pb-6 overflow-hidden flex flex-col items-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(9, 9, 11, 0.09);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        .dark .glass-panel {
          background: rgba(10, 10, 10, 0.75);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .message-glass {
          background: rgba(244, 244, 245, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(9, 9, 11, 0.06);
        }
        .dark .message-glass {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .rich-chat-content span.bg-lime {
          background-color: var(--primary) !important;
        }
        .dark .rich-chat-content span.bg-lime {
          background-color: oklch(0.82 0.21 128) !important;
        }
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 99px;
        }
        .dark .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 99px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .dark .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .rich-chat-content h3 { font-size: 0.95rem !important; font-weight: 700 !important; color: #84cc16 !important; margin-bottom: 0.5rem !important; margin-top: 0.25rem !important; display: flex !important; align-items: center !important; gap: 0.375rem !important; }
        .rich-chat-content p { font-size: 0.875rem !important; line-height: 1.55 !important; color: inherit !important; opacity: 0.95 !important; margin-bottom: 0.625rem !important; }
        .rich-chat-content ul { font-size: 0.875rem !important; line-height: 1.55 !important; color: inherit !important; opacity: 0.92 !important; margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
        .rich-chat-content li { margin-bottom: 0.35rem !important; }
        .rich-chat-content div { font-size: 0.775rem !important; line-height: 1.45 !important; margin-top: 0.75rem !important; padding: 0.75rem !important; border-radius: 0.75rem !important; background-color: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.08) !important; color: inherit !important; }
        .scrollbar-none::-webkit-scrollbar { display: none !important; }
        .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}} />

      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none z-0" />
      <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-gradient-to-br from-primary/20 dark:from-lime/20 via-leaf/10 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-40 -left-40 size-[600px] rounded-full bg-gradient-to-tr from-primary/10 via-primary/5 dark:via-lime/5 to-transparent blur-3xl pointer-events-none z-0" />

      <div className="max-w-5xl w-full px-4 sm:px-6 relative z-10 flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="mb-3 lg:mb-5 shrink-0">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {t.backHome}
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch overflow-hidden">
          
          {/* Left panel: Info & Language Selector */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 overflow-y-auto pr-1 select-none shrink-0 min-h-0 chat-scrollbar">
            <Card className="glass-panel border-none shadow-[0_16px_32px_rgba(0,0,0,0.05)] rounded-3xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border/40 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex items-center gap-4">
                
                {/* Glowing Avatar */}
                <div className="relative shrink-0 select-none">
                  {/* Outer rotating gradient ring */}
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-primary via-primary dark:via-lime to-emerald-500 opacity-80 blur-[2px] animate-spin-slow" />
                  {/* Inner container */}
                  <div className="relative size-11 rounded-xl bg-charcoal p-2 flex items-center justify-center border border-white/10 z-10">
                    <img src="/favicon.ico" alt="Signova Logo" className="size-full object-contain" />
                  </div>
                  {/* Multi-layered status ping */}
                  <span className="absolute -bottom-1 -right-1 z-20 flex size-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 scale-150 [animation-delay:0.2s]" />
                    <span className="relative inline-flex rounded-full size-3 bg-emerald-500 border border-background shadow-xs" />
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">
                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {t.headerTitle}
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {t.headerSub}
                  </p>
                </div>
              </div>
              
              <CardContent className="p-6 flex-1 flex flex-col gap-6">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-deep dark:text-leaf flex items-center gap-1.5">
                    <Globe className="size-3.5" /> Select Language / भाषा चुनें
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(LOCALIZATION) as LanguageKey[]).map((key) => {
                      const active = lang === key;
                      const langConfig = LOCALIZATION[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleLangChange(key)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                            active 
                              ? "bg-primary text-primary-foreground border-primary scale-[1.02] shadow-inner font-bold" 
                              : "bg-deep/10 dark:bg-black/50 text-deep dark:text-foreground border-deep/20 dark:border-border/80 hover:bg-deep/20"
                          }`}
                        >
                          <span className="text-sm">{langConfig.nativeName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-deep dark:text-leaf flex items-center gap-1">
                    <HelpCircle className="size-3.5" /> Quick Agro Guides
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Try typing <strong>cotton leaf reddening</strong>, <strong>chilli square shedding</strong>, or <strong>nano urea distributor</strong> for tailored advice schedules.
                  </p>
                  <a 
                    href="https://wa.me/919876543210" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-500 text-xs font-semibold group transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="size-3.5 text-primary dark:text-lime" /> Talk to Field Officer
                    </span>
                    <ArrowUpRight className="size-4 text-primary dark:text-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right panel: Chat Container */}
          <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 h-full overflow-hidden">
            {renderChatCard()}
          </div>

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DYNAMIC MULTILINGUAL NLP KNOWLEDGE ENGINE (LOCAL DATABASE)
// -------------------------------------------------------------
function getLocalAgroResponse(prompt: string, lang: LanguageKey): string {
  const query = prompt.toLowerCase();
  
  const kwCotton = ["cotton", "कपास", "पत्ती", "పత్తి", "કપાસ", "કાપસ", "कापूस", "பருத்தி", "ಹತ್ತಿ"];
  const kwChilli = ["chilli", "chili", "मिर्च", "మిరప", "మరచ", "મરચાં", "मिरची", "மிளகாய்", "ಮೆಣಸಿನಕಾಯಿ"];
  const kwPaddy = ["paddy", "rice", "धान", "వరి", "ડાંગર", "भात", "நெல்", "ನೆಲ್ಲು", "ಭತ್ತ"];
  const kwZinc = ["zinc", "जिंक", "జింక్", "ઝિંક", "झिंक", "துത്തநாகம்", "ನ್ಯಾನೋ ಜಿಂಕ್"];
  const kwDistributor = ["distributor", "dealership", "partner", "वितरक", "డిస్ట్రిబ్యూటర్", "విక్రయ", "વيتરક", "डीलर्स", "விநியோகஸ்தர்", "ವಿತರಕ"];
  const kwContact = ["contact", "address", "phone", "सम्पर्क", "ఫోన్", "સરનામું", "संपर्क", "முகவரி", "ಸಂಪರ್ಕ", "location"];

  if (kwCotton.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Cotton Crop Nutrition Guide</h3>
        <p>Cotton requires deep balanced chelated micronutrients during vegetative and flowering phases to boost yields and prevent leaf reddening.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Product Recommendation:</strong> <strong>Signova Cotton Special</strong> (Supreme Chelated Mixture) + <strong>Nano Zinc Liquid</strong> (40,000 ppm).</li>
          <li><strong>Soil Prep:</strong> Apply Silica Granules at basal dressing (5kg/acre).</li>
          <li><strong>Vegetative Spray (30-45 Days):</strong> Spray <em>Signova Cotton Special</em> 2.5g/L + <em>Nano Zinc</em> 2ml/L to stimulate branching.</li>
          <li><strong>Flowering Stage:</strong> Spray <em>Signova Chilli-Max / Grow-Plus</em> to stop square dropping.</li>
        </ul>
        <div class="mt-2.5 p-2 bg-secondary/50 rounded-lg text-[10px]">
          <strong>Tip:</strong> Leaf reddening is a sign of Magnesium/Zinc deficiency. Spraying <strong>Signova Magnesium Plus</strong> instantly corrects this in 48 hours.
        </div>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> कपास फसल पोषण गाइड</h3>
        <p>कपास को अधिक उपज के लिए और पत्तियों के लाल होने से बचाने के लिए शाखाओं के विकास और फूलों की अवस्था के दौरान संतुलित सूक्ष्म पोषक तत्वों की आवश्यकता होती है.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>उत्पाद अनुशंसा:</strong> <strong>सिग्नोवा कॉटन स्पेशल</strong> (सुप्रीम चिलेटेड मिश्रण) + <strong>नैनो जिंक लिक्विड</strong> (40,000 ppm).</li>
          <li><strong>मिट्टी की तैयारी:</strong> बुआई के समय सिग्नोवा सिलिका ग्रेन्यूल्स (5 किग्रा/एकड़) का उपयोग करें.</li>
          <li><strong>शाखा विकास (30-45 दिन):</strong> शाखाओं को बढ़ावा देने के लिए <em>कॉटन स्पेशल</em> 2.5 ग्राम/लीटर + <em>नैनो जिंक</em> 2 मिली/लीटर का छिड़काव करें.</li>
          <li><strong>फूल आने की अवस्था:</strong> फूलों को गिरने से रोकने के लिए <em>ग्रो-प्लस</em> का छिड़काव करें.</li>
        </ul>
        <div class="mt-2.5 p-2 bg-secondary/50 rounded-lg text-[10px]">
          <strong>सुझाव:</strong> पत्तियों का लाल होना मैग्नीशियम/जिंक की कमी का संकेत है. <strong>सिग्नोवा मैग्नीशियम प्लस</strong> का छिड़काव इसे 48 घंटों में ठीक कर देता.
        </div>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> పత్తి పంట పోషక మార్గదర్శిని</h3>
        <p>పత్తి పంట అధిక దిగుబడి సాధించడానికి మరియు ఆకులు ఎర్రబడకుండా నిరోధించడానికి శాఖల పెరుగుదల మరియు పూత దశలలో సమతుల్య మైక్రోన్యూట్రియెంట్లు చాలా ముఖ్యం.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>ఉత్పత్తి సిఫార్సు:</strong> <strong>సిగ్నోవా కాటన్ స్పెషల్</strong> (చిలేటెడ్ మిశ్రమం) + <strong>నానో జింక్ లిక్విడ్</strong> (40,000 ppm).</li>
          <li><strong>నేల తయారీ:</strong> ఎకరాకు 5 కిలోల సిగ్నోవా సిలికా గ్రాన్యూల్స్ బేసల్ డోస్‌గా వేయండి.</li>
          <li><strong>శాఖల దశ (30-45 రోజులు):</strong> <em>కాటన్ స్పెషల్</em> 2.5 గ్రా/లీటర్ + <em>నానో జింక్</em> 2 మి.లీ/లీటర్ కలిపి పిచికారీ చేయండి.</li>
          <li><strong>పూత దశ:</strong> పూత మరియు కాయలు రాలకుండా నిరోధించడానికి <em>గ్రో-ప్లస్</em> ఉపయోగించండి.</li>
        </ul>
        <div class="mt-2.5 p-2 bg-secondary/50 rounded-lg text-[10px]">
          <strong>సలహా:</strong> పత్తి ఆకులు ఎర్రబడటం అనేది మెగ్నీషియం/జింక్ లోపానికి ప్రధాన కారణం. దీనిని నివారించడానికి <strong>సిగ్నోవా మెగ్నీషియం ప్లస్</strong> పిచికారీ చేయండి.
        </div>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> કપાસ પાક પોષણ માર્ગદર્શિકા</h3>
        <p>કપાસના પાકમાં સારી ઉપજ અને પાન લાલ થતા અટકાવવા માટે શાખાઓ અને ફૂલોની અવસ્થામાં પોષક તત્વો ખૂબ જ મહત્વના છે.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>ખાસ ભલામણ:</strong> <strong>સિગ્નોવા કોટન સ્પેશિયલ</strong> (ચિલેટેડ મિશ્રણ) + <strong>નેનો ઝિંક પ્રવાહી</strong> (40,000 ppm).</li>
          <li><strong>પાયાનું ખાતર:</strong> એકર દીઠ 5 કિલો સિગ્નોવા સિલિકા દાણાદાર વાપરો.</li>
          <li><strong>વિકાસ અવસ્થા (30-45 દિવસ):</strong> <em>કોટન સ્પેશિયલ</em> 2.5 ગ્રામ/લીટર + <em>નેનો ઝિંક</em> 2 મિલી/લીટર પાણીમાં ભેળવી છંટકાવ કરો.</li>
        </ul>
        <div class="mt-2.5 p-2 bg-secondary/50 rounded-lg text-[10px]">
          <strong>ખાસ સલાહ:</strong> પાન લાલ થવા એ મેગ્નેશિયમ/ઝીંકની ઉણપ દર્શાવે છે. આ માટે <strong>સિગ્નોવા મેગ્નેશિયમ પ્લસ</strong> નો છંટકાવ કરો.
        </div>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> कापूस पीक पोषण मार्गदर्शक</h3>
        <p>कापसाचे अधिक उत्पादन घेण्यासाठी आणि पाने लाल पडण्यापासून रोखण्यासाठी संतुलित सूक्ष्म अन्नद्रव्यांची अत्यंत आवश्यकता असते.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>उत्पादन शिफारस:</strong> <strong>सिग्नोवा कॉटन स्पेशल</strong> (चिलेटेड सूक्ष्म अन्नद्रव्ये) + <strong>नॅनो झिंक लिक्विड</strong>.</li>
          <li><strong>पेरणीच्या वेळी:</strong> एकरी ५ किलो सिग्नोवा सिलिका ग्रॅन्यूल्स वापरा.</li>
          <li><strong>फवारणी (३०-४५ दिवस):</strong> <em>कॉटन स्पेशल</em> २.५ ग्रॅम + <em>नॅनो झिंक</em> २ मिली प्रति लीटर पाण्यात मिसळून फवारावे.</li>
        </ul>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> பருத்தி பயிர் ஊட்டச்சத்து வழிகாட்டி</h3>
        <p>பருத்தி பயிரில் இலைகள் சிவப்பாவதை தடுக்கவும், அதிக கிளைகள் மற்றும் பூக்கள் உருவாவதற்கும் நுண்ஊட்டச்சத்துக்கள் அவசியமாகும்.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>பரிந்துரை:</strong> <strong>சிக்னோவா காட்டன் ஸ்பெஷல்</strong> + <strong>நானோ துத்தநாக திரவம்</strong> (40,000 ppm).</li>
          <li><strong>இலை சிவப்பாதல் தீர்வு:</strong> இலைகள் சிவப்பதை தடுக்க <strong>சிக்னோவா மெக்னீசியம் பிளஸ்</strong> தெளிக்கவும்.</li>
        </ul>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಹತ್ತಿ ಬೆಳೆ ಪೋಷಣೆ ಮಾರ್ಗದರ್ಶಿ</h3>
        <p>ಹತ್ತಿ ಬೆಳೆಯಲ್ಲಿ ಅಧಿಕ ಇಳುವರಿ ಪಡೆಯಲು ಮತ್ತು ಎಲೆಗಳು ಕೆಂಪಾಗುವುದನ್ನು ತಡೆಯಲು ಸಮತೋಲಿತ ಮೈಕ್ರೋನ್ಯೂಟ್ರಿಯೆಂಟ್ಸ್ ಅವಶ್ಯಕವಾಗಿದೆ.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>ಶಿಫಾರಸು:</strong> <strong>ಸಿಗ್ನೋವಾ ಕಾಟನ್ ಸ್ಪೆಷಲ್</strong> + <strong>ನ್ಯಾನೋ ಜಿಂಕ್ ಲಿಕ್ವಿಡ್</strong>.</li>
        </ul>
      `
    };
    return data[lang] || data.en;
  }

  if (kwChilli.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Chilli Crop Nutrition Program</h3>
        <p>Chilli crops require targeted calcium, boron, and zinc to prevent flower drop, leaf curl, and fruit rot (anthracnose).</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Product Recommendation:</strong> <strong>Signova Chilli-Max</strong> + <strong>Grow-Plus Bio-stimulant</strong>.</li>
          <li><strong>Active Phase Spray (Pre-flowering):</strong> Spray <em>Signova Chilli-Max</em> 2ml/L + <em>Boron-10</em> 1g/L. This guarantees dense flowering and thick skin, protecting pods from rot.</li>
          <li><strong>Growth Enhancer:</strong> Apply <em>Grow-Plus</em> (2.5ml/L) to build strong root systems and increase viral/curl resistance.</li>
        </ul>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> मिर्च फसल पोषण कार्यक्रम</h3>
        <p>मिर्च की फसल को फूल गिरने, पत्ती मुड़ने (लीफ कर्ल) और फल सड़न रोकने के लिए कैल्शियम, बोरॉन और जिंक की आवश्यकता होती है.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>उत्पाद अनुशंसा:</strong> <strong>सिग्नोवा मिर्च-मैक्स</strong> + <strong>ग्रो-प्लस बायो-स्टिमुलेंट</strong>।</li>
          <li><strong>फ्लावरिंग पूर्व छिड़काव:</strong> <em>मिर्च-मैक्स</em> 2 मिली/लीटर + <em>बोरॉन</em> 1 ग्राम/लीटर का छिड़काव करें. इससे फूल गिरने की समस्या 90% तक कम हो जाती है.</li>
        </ul>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> మిరప పంట పోషక ప్రణాళిక</h3>
        <p>మిరపలో పూత రాలడం, ఆకు ముడత మరియు కాయ కుళ్లు తెగుళ్లను నివారించడానికి కాల్షియం, బోరాన్ మరియు జింక్ చాలా అవసరం.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>ఉత్పత్తి సిఫార్సు:</strong> <strong>సిగ్నోవా మిర్చి-మాక్స్</strong> + <strong>గ్రో-ప్లస్ బయో-స్టిమ్యులెంట్</strong>.</li>
          <li><strong>పూతకు ముందు పిచికారీ:</strong> <em>మిర్చి-మాక్స్</em> 2 మి.లీ/లీటర్ + <em>బోరాన్</em> 1 గ్రా/లీటర్ కలిపి పిచికారీ చేయండి. ఇది పూత బలంగా మారడానికి సహాయపడుతుంది.</li>
        </ul>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> મરચાં પાક પોષણ કાર્યક્રમ</h3>
        <p>મરચાંના પાકમાં ફૂલ ખરતા અટકાવવા અને ફળ સડો રોકવા માટે બોરોન, કેલ્શિયમ અને ઝીંક આપવું જરૂરી છે.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>ખાસ ભલામણ:</strong> <strong>સિગ્નોવા મરચાં-મેક્સ</strong> + <strong>ગ્રો-પલ્સ બાયો-સ્ટિમ્યુલન્ટ</strong>.</li>
        </ul>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> मिरची पीक पोषण कार्यक्रम</h3>
        <p>मिरचीचे फूल गळणे रोखण्यासाठी आणि फळ सडणे थांबवण्यासाठी कॅल्शियम, बोरॉन आणि झिंकचे योग्य व्यवस्थापन आवश्यक आहे.</p>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> மிளகாய் பயிர் ஊட்டச்சத்து திட்டம்</h3>
        <p>பூக்கள் கொட்டுவதைத் தடுக்கவும், காய் அழுகல் நோயை கட்டுப்படுத்தவும் கால்சியம் மற்றும் போரான் சத்துக்கள் அவசியம்.</p>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಮೆಣಸಿನಕಾಯಿ ಬೆಳೆ ಪೋಷಣೆ ಪ್ರೋಗ್ರಾಂ</h3>
      `
    };
    return data[lang] || data.en;
  }

  if (kwPaddy.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Paddy & Rice Nutrition Program</h3>
        <p>Zinc deficiency is the single biggest threat to rice crops in India, causing the destructive <strong>Khaira Disease</strong> (rusty brown leaf spots).</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Solution:</strong> Apply <strong>Signova Chelated Zinc 12%</strong> (EDTA) or spray <strong>Nano Zinc Liquid</strong> (40,000 ppm) at tillering phase.</li>
          <li><strong>Dosage (Spray):</strong> 1.5ml to 2ml of Nano Zinc per Litre of water at 25 and 45 days after transplanting.</li>
          <li><strong>Stem Strength:</strong> Apply Silica granules to increase grain weight and prevent crop lodging during high winds.</li>
        </ul>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> धान/चावल पोषण कार्यक्रम</h3>
        <p>जिंक की कमी धान की फसल में <strong>खैरा रोग</strong> (पत्तियों पर भूरे धब्बे) का कारण बनती है, जिससे उपज में भारी गिरावट आती है.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>समाधान:</strong> कल्ले निकलते समय <strong>सिग्नोवा चिलेटेड जिंक 12%</strong> या <strong>नैनो जिंक लिक्विड</strong> (40,000 ppm) का छिड़काव करें.</li>
          <li><strong>मात्रा:</strong> रोपाई के 25 और 45 दिनों बाद 1.5 से 2 मिली नैनो जिंक प्रति लीटर पानी में मिलाकर छिड़कें.</li>
        </ul>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> వరి పంట పోషక యాజమాన్యం</h3>
        <p>వరి పంటలో జింక్ లోపం వల్ల <strong>ఖైరా తెగులు</strong> (ఆకులపై తుప్పు రంగు మచ్చలు) వచ్చి దిగుబడి క్షీణిస్తుంది.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>పరిష్కారం:</strong> వరి నాటిన 25 మరియు 45 రోజులలో <strong>సిగ్నోవా చిలేటెడ్ జింక్ 12%</strong> లేదా <strong>నానో జింక్ లిక్విడ్</strong> పిచికారీ చేయండి.</li>
          <li><strong>మోతాదు:</strong> లీటరు నీటికి 1.5 - 2 మి.లీ నానో జింక్ కలిపి పిచికారీ చేయాలి.</li>
        </ul>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ડાંગર/ચોખા పోషక ప్రణాళిక</h3>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> भात शेती पोषण कार्यक्रम</h3>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> நெல் பயிர் ஊட்டச்சத்து திட்டம்</h3>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಭತ್ತದ ಬೆಳೆ ಪೋಷಣೆ ಪ್ರೋಗ್ರಾಂ</h3>
      `
    };
    return data[lang] || data.en;
  }

  if (kwZinc.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Signova Nano Zinc Liquid (40,000 ppm)</h3>
        <p>Our advanced Nano Zinc represents the pinnacle of nanotechnology in agriculture, replacing bulky traditional zinc powders.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Efficacy:</strong> Ultra-fine particle sizes (&lt; 50nm) allow direct penetration into leaf stomata for 95% absorption efficiency.</li>
          <li><strong>Dosage:</strong> Spray 20-30ml per 15L spray tank.</li>
          <li><strong>Benefit:</strong> Minimizes soil fixing, prevents zinc deficiency, boosts chlorophyll creation, and delivers 15-22% increase in grain/fruit sizes.</li>
        </ul>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा नैनो जिंक लिक्विड (40,000 ppm)</h3>
        <p>हमारा अत्याधुनिक नैनो जिंक कृषि में नैनोटेक्नोलॉजी का उत्कृष्ट उदाहरण है, जो भारी पारंपरिक जिंक सल्फेट पाउडर की जगह लेता है.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>प्रभावशीलता:</strong> सूक्ष्म कण आकार (&lt; 50nm) पत्तियों के छिद्रों में सीधे प्रवेश करते हैं जिससे 95% पोषण सोख लिया जाता है।</li>
          <li><strong>मात्रा:</strong> 15 लीटर वाले स्प्रे पंप में 20 से 30 मिली नैनो जिंक मिलाएं.</li>
        </ul>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> సిగ్నోవా నానో జింక్ లిక్విడ్ (40,000 ppm)</h3>
        <p>మా నానో జింక్ వ్యవసాయంలో నానోటెక్నాలజీకి అత్యుత్తమ నిదర్శనం. ఇది సాధారణ జింక్ పౌడర్ల కంటే చాలా శక్తివంతమైనది.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>శక్తివంతమైన పనితీరు:</strong> అతి సూక్ష్మ కణాలు ఆకుల రంధ్రాల గుండా నేరుగా లోపలికి చొచ్చుకుపోయి 95% కంటే ఎక్కువ గ్రహించబడతాయి.</li>
          <li><strong>మోతాదు:</strong> 15 లీటర్ల ట్యాంకుకు 20 - 30 మి.లీ నానో జింక్ వేయండి.</li>
        </ul>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> સિગ્નોવા નેનો ઝિંક પ્રવાહી (40,000 ppm)</h3>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा नॅनो झिंक लिक्विड (40,000 ppm)</h3>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> சிக்னோவா நானோ துத்தநாக திரவம் (40,000 ppm)</h3>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಸಿಗ್ನೋವಾ ನ್ಯಾನೋ ಜಿಂಕ್ ಲಿಕ್ವಿಡ್ (40,000 ppm)</h3>
      `
    };
    return data[lang] || data.en;
  }

  if (kwDistributor.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Partner with Signova (Become a Distributor)</h3>
        <p>Join our massive channel of 3,000+ dealers expanding across India. We offer premium profit margins and complete agronomic field backing.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Requirements:</strong> Valid retail/wholesale Fertilizer License, GST Registration, and initial stock order of ₹1.5 Lakhs.</li>
          <li><strong>Benefits:</strong> Regional agronomist training, high retail profit margins, marketing materials, and localized farmer camps.</li>
          <li><strong>Next Steps:</strong> Visit our Become Distributor Page or fill out the form at Contact Us. Our regional sales manager will reach out within 24 hours.</li>
        </ul>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा के साथ साझेदारी (वितरक बनें)</h3>
        <p>भारत भर में फैले हमारे 3,000+ डीलरों के बड़े नेटवर्क में शामिल हों. हम प्रीमियम मुनाफा मार्जिन और पूर्ण ऑन-फील्ड सहायता प्रदान करते हैं.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>आवश्यकताएँ:</strong> वैध खुदरा/थोक उर्वरक लाइसेंस (Fertilizer License), जीएसटी पंजीकरण (GST Number) और न्यूनतम ₹1.5 लाख का पहला ऑर्डर।</li>
        </ul>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> సిగ్నోవాతో భాగస్వామ్యం (డిస్ట్రిబ్యూటర్ అవ్వండి)</h3>
        <p>భారతదేశం అంతటా విస్తరిస్తున్న మా 3,000+ డీలర్ల నెట్‌వర్క్‌లో చేరండి. మేము గరిష్ట లాభాలు మరియు సంపూర్ణ మార్కెటింగ్ మద్దతును అందిస్తాము.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>అర్హతలు:</strong> చెల్లుబాటు అయ్యే ఫెర్టిలైజర్ లైసెన్స్, జిఎస్‌టి రిజిస్ట్రేషన్ మరియు కనీసం ₹1.5 లక్షల విలువైన మొదటి ఆర్డర్.</li>
        </ul>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> સિગ્નોવા ડિસ્ટ્રિબ્યુટર બનો</h3>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा वितरक व्हा</h3>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> சிக்னோவா விநியோகஸ்தர் ஆகுங்கள்</h3>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಸಿಗ್ನೋವಾ ವಿತರಕರಾಗಿ</h3>
      `
    };
    return data[lang] || data.en;
  }

  if (kwContact.some(k => query.includes(k))) {
    const data: Record<LanguageKey, string> = {
      en: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> Contact Signova Group</h3>
        <p>Our agronomists and support officers are ready to answer your calls!</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>Headquarters:</strong> Plot 42, Genome Valley, Hyderabad, Telangana, India.</li>
          <li><strong>Phone:</strong> +91 98765 43210 (Mon-Sat, 9:00 AM to 6:00 PM)</li>
          <li><strong>Email:</strong> info@signovagroup.com</li>
        </ul>
      `,
      hi: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा ग्रुप से संपर्क करें</h3>
        <p>हमारे कृषि विशेषज्ञ आपकी सहायता के लिए तैयार हैं.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>मुख्यालय:</strong> प्लॉट 42, जीनोम वैली, हैदराबाद, तेलंगाना, भारत।</li>
          <li><strong>फोन:</strong> +91 98765 43210 (सोमवार-शनिवार, सुबह 9:00 से शाम 6:00 बजे)</li>
          <li><strong>ईमेल:</strong> info@signovagroup.com</li>
        </ul>
      `,
      te: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> సిగ్నోవా గ్రూప్‌ను సంప్రదించండి</h3>
        <p>మా నిపుణుల బృందం మీకు సహాయం చేయడానికి ఎల్లప్పుడూ సిద్ధంగా ఉంటుంది.</p>
        <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
          <li><strong>కార్యాలయం:</strong> ప్లాట్ 42, జెనోమ్ వ్యాలీ, హైదరాబాద్, తెలంగాణ, భారతదేశం.</li>
          <li><strong>ఫోన్:</strong> +91 98765 43210 (సోమ-శని, ఉదయం 9:00 నుండి సాయంత్రం 6:00 వరకు)</li>
          <li><strong>ఇమెయిల్:</strong> info@signovagroup.com</li>
        </ul>
      `,
      gu: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> સિગ્નોવા ગ્રુપ નો સંપર્ક કરો</h3>
      `,
      mr: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> सिग्नोवा ग्रुप संपर्क</h3>
      `,
      ta: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> சிக்னோவா குழுமத்தை தொடர்பு கொள்ளவும்</h3>
      `,
      kn: `
        <h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime"></span> ಸಿಗ್ನೋವಾ ಸಮೂಹ ಸಂಪರ್ಕ</h3>
      `
    };
    return data[lang] || data.en;
  }

  const fallbacks: Record<LanguageKey, string> = {
    en: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> Signova Crop Care Advisor</h3>
      <p>Thank you for asking! I want to help you optimize your crop health. While this exact query is not loaded in our built-in product dataset, here are three easy ways to get answers:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>Read Expert Guides:</strong> Check out our Knowledge Centre for crop nutrition sheets.</li>
        <li><strong>Live Expert Call:</strong> Call our field agronomists at +91 98765 43210.</li>
        <li><strong>Unlock Gemini AI:</strong> Click the <strong>Settings Cog</strong> at the top right, enter your Gemini API key, and experience fully intelligent, unrestricted agricultural chat!</li>
      </ul>
    `,
    hi: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> सिग्नोवा फसल देखभाल सलाहकार</h3>
      <p>पूछने के लिए धन्यवाद! मैं आपकी फसल के स्वास्थ्य को बेहतर बनाने में मदद करना चाहता हूँ. यद्यपि यह विशिष्ट प्रश्न हमारे ऑफ़लाइन उत्पाद डेटाबेस में नहीं है, लेकिन आप निम्न तरीकों से सहायता प्राप्त कर सकते हैं:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>ज्ञान केंद्र देखें:</strong> फसल पत्रकों के लिए हमारा ज्ञान केंद्र देखें.</li>
        <li><strong>विशेषज्ञ से सीधे बात करें:</strong> हमारे कृषि अधिकारियों से <strong>+91 98765 43210</strong> पर संपर्क करें.</li>
        <li><strong>जेमिनी एआई अनलॉक करें:</strong> ऊपर दाईं ओर <strong>सेटिंग गियर</strong> पर क्लिक करके अपनी जेमिनी एपीआई की दर्ज करें और पूर्ण बुद्धिमत्तापूर्ण कृषि चैट का आनंद लें!</li>
      </ul>
    `,
    te: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> సిగ్నోవా పంట రక్షణ సలహాదారు</h3>
      <p>అడిగినందుకు ధన్యవాదాలు! మీ పంట ఆరోగ్యం మరియు దిగుబడిని పెంచడానికి నేను మీకు సహాయం చేయాలనుకుంటున్నాను. ఈ నిర్దిష్ట ప్రశ్న మా నిల్వ డేటాబేస్ లో లేదు, కానీ మీరు ఈ క్రింది మార్గాల ద్వారా జవాబులను పొందవచ్చు:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>నాలెడ్జ్ సెంటర్ చూడండి:</strong> పంటల సమాచారం కోసం మా నాలెడ్జ్ సెంటర్ క్లిక్ చేయండి.</li>
        <li><strong>వ్యవసాయ అధికారితో మాట్లాడండి:</strong> వెంటనే <strong>+91 98765 43210</strong> కి ఫోన్ చేయండి.</li>
        <li><strong>జెమిని AI ని సక్రియం చేయండి:</strong> కుడి వైపున ఉన్న <strong>సెట్టింగ్స్ గుర్తు</strong> పై క్లిక్ చేసి, మీ జెమిని API కీని నమోదు చేయడం ద్వారా అపరిమిత సంభాషణలను పొందండి!</li>
      </ul>
    `,
    gu: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> સિગ્નોવા પાક સંભાળ સલાહકાર</h3>
      <p>પૂછવા માટે આભાર! હું તમારા પાકનું સ્વાસ્થ્ય સુધારવામાં મદદ કરવા માંગું છું. જો કે આ પ્રશ્ન અમારા બિલ્ટ-ઇન પ્રોડક્ટ ડેટાબેઝમાં નથી, પરંતુ ઉત્તરો મેળવવા માટેના ત્રણ સરળ રસ્તાઓ અહીં છે:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>નિષ્ણાત માર્ગદર્શિકાઓ વાંચો:</strong> પાક પોષણ પત્રકો માટે અમારા જ્ઞાન કેન્દ્રની મુલાકાત લો.</li>
        <li><strong>લાઈવ નિષ્ણાત કોલ:</strong> અમારા કૃષિ અધિકારીઓને <strong>+91 98765 43210</strong> પર કોલ કરો.</li>
        <li><strong>જેમિની AI અનલૉક કરો:</strong> ઉપર જમણી બાજુએ <strong>સેટિંગ્સ ગિયર</strong> પર ક્લિક કરો, તમારી જેમિની API કી દાખલ કરો અને સંપૂર્ણ બુદ્ધિશાળી કૃષિ ચેટનો અનુભવ કરો!</li>
      </ul>
    `,
    mr: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> सिग्नोवा पीक काळजी सल्लागार</h3>
      <p>विचारल्याबद्दल धन्यवाद! मला तुमच्या पिकाचे आरोग्य सुधारण्यास मदत करायची आहे. जरी हा विशिष्ट प्रश्न आमच्या अंगभूत उत्पादन डेटाबेसमध्ये नसला तरी, उत्तरे मिळवण्याचे तीन सोपे मार्ग खालीलप्रमाणे आहेत:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>तज्ज्ञ मार्गदर्शक वाचा:</strong> पीक पोषण पत्रकांसाठी आमच्या ज्ञान केंद्राला भेट द्या.</li>
        <li><strong>थेट तज्ज्ञ कॉल:</strong> आमच्या कृषी अधिकाऱ्यांशी <strong>+91 98765 43210</strong> वर संपर्क साधा.</li>
        <li><strong>जेमिनी AI अनलॉक करा:</strong> वर उजवीकडील <strong>सेटिंग्ज गियर</strong> वर क्लिक करा, तुमची जेमिनी API की प्रविष्ट करा आणि पूर्णपणे बुद्धिमान कृषी चॅटचा अनुभव घ्या!</li>
      </ul>
    `,
    ta: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> சிக்னோவா பயிர் பராமரிப்பு ஆலோசகர்</h3>
      <p>கேட்டதற்கு நன்றி! உங்கள் பயிர் ஆரோக்கியத்தை மேம்படுத்த நான் உங்களுக்கு உதவ விரும்புகிறேன். இந்த குறிப்பிட்ட கேள்வி எங்களது தயாரிப்பு தரவுத்தளத்தில் இல்லை என்றாலும், பதில்களைப் பெற மூன்று எளிய வழிகள் இதோ:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>நிபுணர் வழிகாட்டிகளைப் படியுங்கள்:</strong> பயிர் ஊட்டச்சத்து தாள்களுக்கு எங்களது அறிவு மையத்தை (Knowledge Centre) பார்வையிடவும்.</li>
        <li><strong>நேரடி நிபுணர் அழைப்பு:</strong> எங்கள் கள விவசாய அதிகாரிகளை <strong>+91 98765 43210</strong> என்ற எண்ணில் அழைக்கவும்.</li>
        <li><strong>ஜெமினி AI-ஐ அன்லாக் செய்யவும்:</strong> மேலே வலதுபுறத்தில் உள்ள <strong>அமைப்புகள் ஐகானை</strong> கிளிக் செய்து, உங்கள் ஜெமினி API கீயை உள்ளிட்டு முழுமையான அறிவார்ந்த விவசாய அரட்டையை அனுபவிக்கவும்!</li>
      </ul>
    `,
    kn: `
      <h3 class="text-sm font-bold text-amber-500 flex items-center gap-1.5"><span class="size-2 rounded-full bg-amber-500"></span> ಸಿಗ್ನೋವಾ ಬೆಳೆ ಆರೈಕೆ ಸಲಹೆಗಾರ</h3>
      <p>ಕೇಳಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಬೆಳೆ ಆರೋಗ್ಯವನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ. ಈ ಪ್ರಶ್ನೆಯು ನಮ್ಮ ಅಂತರ್ನಿಮಿತ ಉತ್ಪನ್ನ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಇಲ್ಲದಿದ್ದರೂ, ಉತ್ತರಗಳನ್ನು ಪಡೆಯಲು ಮೂರು ಸುಲಭ ಮಾರ್ಗಗಳು ಇಲ್ಲಿವೆ:</p>
      <ul class="list-disc pl-4 space-y-1 mt-2 text-xs">
        <li><strong>ತಜ್ಞರ ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ಓದಿ:</strong> ಬೆಳೆ ಪೋಷಣೆ ಹಾಳೆಗಳಿಗಾಗಿ ನಮ್ಮ ಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು (Knowledge Centre) ಪರಿಶೀಲಿಸಿ.</li>
        <li><strong>ಲೈವ್ ತಜ್ಞರ ಕರೆ:</strong> ನಮ್ಮ ಕೃಷಿ ತಜ್ಞರನ್ನು <strong>+91 98765 43210</strong> ಗೆ ಕರೆ ಮಾಡಿ.</li>
        <li><strong>ಜೀಮಿನಿ AI ಅನ್‌ಲಾಕ್ ಮಾಡಿ:</strong> ಮೇಲಿನ ಬಲ ಭಾಗದಲ್ಲಿರುವ <strong>ಸೆಟ್ಟಿಂಗ್ಸ್ ಐಕಾನ್</strong> ಕ್ಲಿಕ್ ಮಾಡಿ, ನಿಮ್ಮ ಜೆಮಿನಿ API ಕೀಲಿಯನ್ನು ನಮೂದಿಸಿ ಮತ್ತು ಸಂಪೂರ್ಣ ಬುದ್ಧಿವಂತ ಕೃಷಿ ಚಾಟ್ ಅನ್ನು ಅನುಭವಿಸಿ!</li>
      </ul>
    `
  };

  return fallbacks[lang] || fallbacks.en;
}

// -------------------------------------------------------------
// GOOGLE GEMINI FLASH API CONNECTOR (LIVE LLM)
// -------------------------------------------------------------
async function fetchGeminiResponse(userPrompt: string, lang: LanguageKey, key: string): Promise<string> {
  const langConfig = LOCALIZATION[lang];
  const systemPrompt = `You are Signova AI, a professional crop nutritionist, soil health expert, and agricultural consultant working for Signova Group.
Your goal is to warmly and professionally help farmers, agro-distributors, and dealers who are looking for soil correction plans, fertilizer schedules, and chelated micronutrient products.
You have expertise in advanced products of Signova Group:
1. Signova Nano-Zinc Liquid (40,000 ppm, highly bio-available)
2. Signova Cotton Special (supreme chelated mix for cotton reddening correction)
3. Signova Chilli-Max (calcium, boron and zinc mixture to prevent pod rot and square shedding)
4. Chelated Magnesium, Silica granules, and premium grow bio-stimulants.

You MUST respond strictly in the user's selected language: ${langConfig.name} (${langConfig.nativeName}).
Always write structured, farmer-friendly, warm and actionable advice. Use bullet points and markdown bolding where helpful to make the text easy to read in mobile layouts.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: Status ${response.status}`);
    }

    const json = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!candidateText) {
      throw new Error("Invalid response format from Gemini API");
    }

    return candidateText;
  } catch (err: any) {
    console.error("Gemini fetch failed:", err);
    throw err;
  }
}

// -------------------------------------------------------------
// PREMIUM MARKDOWN-TO-HTML FORMATTER FOR AI CHATBOT RESPONSES
// -------------------------------------------------------------
function formatMarkdownToHtml(md: string): string {
  let html = md;
  
  // 1. Replace headers ### text to <h3>text</h3>
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime shrink-0"></span> $1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h3 class="text-sm font-bold text-leaf flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime shrink-0"></span> $1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h3 class="text-base font-extrabold text-leaf flex items-center gap-1.5"><span class="size-2.5 rounded-full bg-lime shrink-0"></span> $1</h3>');

  // 2. Replace bold **text** to <strong>text</strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 3. Process bullet lists (lines starting with - or *)
  const lines = html.split('\n');
  let inList = false;
  const processedLines = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      if (!inList) {
        processedLines.push('<ul class="list-disc pl-4 space-y-1 mt-2 text-xs">');
        inList = true;
      }
      processedLines.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  }
  if (inList) {
    processedLines.push('</ul>');
  }

  html = processedLines.join('\n');

  // 4. Wrap non-html paragraphs in <p> tags with inline breaks
  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<div')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  });
  
  return formattedBlocks.filter(Boolean).join('\n');
}
