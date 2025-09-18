import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Send,
  Bot,
  User,
  Heart,
  Brain,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import aiMascot from '@/assets/ai-mascot.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'supportive' | 'encouraging' | 'calming';
}

interface ChatPageProps {
  onBack: () => void;
  userName: string;
}

const ChatPage = ({ onBack, userName }: ChatPageProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${userName}! 👋 I'm your AI wellness companion. I'm here to listen, support, and help you manage stress. How are you feeling today?`,
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'supportive'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI response logic (in a real app, this would be an API call)
  const generateAIResponse = (userMessage: string): { text: string; emotion: Message['emotion'] } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Stress-related keywords
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelmed')) {
      const stressResponses = [
        {
          text: "I hear that you're feeling stressed. That's completely normal, especially as a student. Let's take a moment together - try taking three deep breaths with me. What's been weighing on your mind the most?",
          emotion: 'calming' as const
        },
        {
          text: "Stress can feel overwhelming, but remember - you've handled difficult situations before and you can handle this too. Would you like to talk about what's causing the stress, or should we try some quick relaxation techniques?",
          emotion: 'supportive' as const
        }
      ];
      return stressResponses[Math.floor(Math.random() * stressResponses.length)];
    }
    
    // Academic-related keywords
    if (lowerMessage.includes('exam') || lowerMessage.includes('study') || lowerMessage.includes('assignment') || lowerMessage.includes('test')) {
      const academicResponses = [
        {
          text: "Academic pressure is real! Remember, your worth isn't defined by grades. Let's break down what you're facing - sometimes talking through your study plan can make things feel more manageable. What subject or task is challenging you most?",
          emotion: 'encouraging' as const
        },
        {
          text: "Exams and assignments can be stressful, but you're taking the right step by reaching out. Have you tried breaking your study material into smaller, manageable chunks? I can help you think through some study strategies!",
          emotion: 'supportive' as const
        }
      ];
      return academicResponses[Math.floor(Math.random() * academicResponses.length)];
    }
    
    // Positive keywords
    if (lowerMessage.includes('good') || lowerMessage.includes('happy') || lowerMessage.includes('great') || lowerMessage.includes('fine')) {
      const positiveResponses = [
        {
          text: "That's wonderful to hear! 😊 I'm so glad you're feeling good. What's been going well for you today? Celebrating the positive moments is important for our mental health.",
          emotion: 'encouraging' as const
        },
        {
          text: "I love hearing that! When we're feeling good, it's a great time to build some positive habits or reflect on what's working well in our lives. Is there anything specific that's contributing to your good mood?",
          emotion: 'supportive' as const
        }
      ];
      return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    }
    
    // Sleep-related
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return {
        text: "Sleep is so important for managing stress and academic performance. Are you having trouble falling asleep, staying asleep, or just not getting enough hours? I can share some tips for better sleep hygiene that many students find helpful.",
        emotion: 'calming' as const
      };
    }
    
    // Gratitude or thanks
    if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
      return {
        text: "You're so welcome! 💙 It means a lot to me that I can be here for you. Remember, seeking support is a sign of strength, not weakness. Is there anything else on your mind that you'd like to talk through?",
        emotion: 'supportive' as const
      };
    }
    
    // Default responses
    const defaultResponses = [
      {
        text: "I'm here to listen and support you. Sometimes just talking through what's on your mind can help clarify things. What would you like to share with me?",
        emotion: 'supportive' as const
      },
      {
        text: "Thank you for sharing that with me. Your feelings are valid, and it's okay to not have everything figured out. What's one small thing that might help you feel a bit better right now?",
        emotion: 'calming' as const
      },
      {
        text: "I appreciate you opening up to me. Remember, every challenge you're facing is temporary, and you have more strength than you realize. How can I best support you today?",
        emotion: 'encouraging' as const
      }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        emotion: response.emotion
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickReplies = [
    "I'm feeling stressed about exams",
    "I need help with motivation", 
    "I'm having trouble sleeping",
    "I want to feel more positive"
  ];

  const getEmotionIcon = (emotion?: Message['emotion']) => {
    switch (emotion) {
      case 'supportive': return <Heart className="w-4 h-4 text-wellness" />;
      case 'encouraging': return <Sparkles className="w-4 h-4 text-energy" />;
      case 'calming': return <Brain className="w-4 h-4 text-calm" />;
      default: return <MessageCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src={aiMascot} alt="AI Friend" className="w-10 h-10 animate-bounce-gentle" />
            <div>
              <h1 className="text-2xl font-bold">AI Wellness Companion</h1>
              <p className="text-sm text-muted-foreground">
                Your friend for stress support and motivation
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-primary/10' 
                      : 'bg-gradient-to-br from-wellness/20 to-calm/20'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-6 h-6 text-primary" />
                    ) : (
                      <Bot className="w-6 h-6 text-wellness" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <Card className={`${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card border shadow-soft'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.sender === 'ai' && message.emotion && (
                          <div className="ml-2 flex-shrink-0">
                            {getEmotionIcon(message.emotion)}
                          </div>
                        )}
                      </div>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex space-x-3 max-w-[80%]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wellness/20 to-calm/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-6 h-6 text-wellness" />
                  </div>
                  <Card className="bg-card border shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="container mx-auto px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3 text-center">Quick topics to get started:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputText(reply)}
                  className="text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-card/80 backdrop-blur-sm border-t shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex space-x-4 max-w-3xl mx-auto">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!inputText.trim() || isTyping}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;