import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Heart, 
  Music, 
  Dumbbell, 
  Bell, 
  User, 
  MessageCircle,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import aiMascot from '@/assets/ai-mascot.png';
import yogaIcon from '@/assets/yoga-icon.png';
import mindeaseIcon from '@/assets/mindease-logo.png';

interface HomePageProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const HomePage = ({ userName, onNavigate }: HomePageProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const mainFeatures = [
    {
      id: 'todo',
      title: 'To-Do List',
      description: 'Organize tasks to reduce stress',
      icon: CheckSquare,
      color: 'primary',
      gradient: 'gradient-primary'
    },
    {
      id: 'meditate',
      title: 'Meditate & Relax',
      description: 'Breathing, meditation & yoga',
      icon: Heart,
      color: 'wellness',
      gradient: 'gradient-calm'
    },
    {
      id: 'music',
      title: 'Calming Playlist',
      description: 'Relaxing music for focus',
      icon: Music,
      color: 'calm',
      gradient: 'gradient-energy'
    },
    {
      id: 'exercise',
      title: 'Stress Relief Exercise',
      description: 'Physical activities for wellness',
      icon: Dumbbell,
      color: 'energy',
      gradient: 'gradient-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={yogaIcon} alt="Yoga" className="w-10 h-10" />
              <div className="flex items-center space-x-2">
                <img src={mindeaseIcon} alt="MINDEASE" className="h-8" />
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="relative"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => onNavigate('notifications')}
              >
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-energy text-energy-foreground p-0 flex items-center justify-center text-xs">
                  2
                </Badge>
              </Button>
              
              {/* Profile */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('profile')}
                className="flex items-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">{userName}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">{userName}</span>! 
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a deep breath. Today is your day to find peace, reduce stress, and achieve balance.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-wellness">85</div>
              <div className="text-sm text-muted-foreground">Calm Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-sm text-muted-foreground">Days Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-energy">12</div>
              <div className="text-sm text-muted-foreground">Tasks Done</div>
            </div>
          </div>
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={feature.id}
              className={`group relative overflow-hidden hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onNavigate(feature.id)}
            >
              <div className={`absolute inset-0 bg-${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardContent className="relative p-8 text-center space-y-4">
                <div className={`inline-flex p-4 rounded-full bg-${feature.color}/10 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  className={`group-hover:text-${feature.color} transition-colors`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational Quote */}
        <div className="text-center mb-8">
          <Card className="max-w-2xl mx-auto bg-gradient-calm/5 border-calm/20">
            <CardContent className="p-6">
              <blockquote className="text-lg italic text-foreground/80">
                "Peace comes from within. Do not seek it without."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-2">- Buddha</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* AI Chatbot Float */}
      <div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer animate-bounce-gentle"
        onClick={() => onNavigate('chat')}
      >
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-primary rounded-full opacity-20 animate-ping" />
          <Card className="relative bg-card shadow-strong hover:shadow-glow transition-all hover:scale-110">
            <CardContent className="p-4">
              <img 
                src={aiMascot} 
                alt="AI Friend" 
                className="w-16 h-16 animate-wave" 
              />
              <div className="absolute -top-2 -right-2">
                <MessageCircle className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;