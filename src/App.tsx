import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserOnboarding from "./components/UserOnboarding";
import HomePage from "./components/HomePage";
import TodoPage from "./components/TodoPage";
import MeditationPage from "./components/MeditationPage";
import MusicPage from "./components/MusicPage";
import ExercisePage from "./components/ExercisePage";
import ChatPage from "./components/ChatPage";

const queryClient = new QueryClient();

interface OnboardingData {
  userType: string;
  stressLevel: string;
  goals: string[];
  personalInfo: {
    name: string;
    age: string;
    occupation: string;
    stressFactors: string;
  };
}

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<OnboardingData | null>(null);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Check if user has already completed onboarding
    const savedUserData = localStorage.getItem('mindease-user-data');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsOnboarded(true);
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData(data);
    setIsOnboarded(true);
    // Save to localStorage for persistence
    localStorage.setItem('mindease-user-data', JSON.stringify(data));
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    // For now, we'll just log navigation - components will be built later
    console.log(`Navigating to: ${page}`);
  };

  const renderCurrentPage = () => {
    if (!isOnboarded || !userData) {
      return <UserOnboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            userName={userData.personalInfo.name} 
            onNavigate={handleNavigation}
          />
        );
      case 'todo':
        return (
          <TodoPage onBack={() => setCurrentPage('home')} />
        );
      case 'meditate':
        return (
          <MeditationPage onBack={() => setCurrentPage('home')} />
        );
      case 'music':
        return (
          <MusicPage onBack={() => setCurrentPage('home')} />
        );
      case 'exercise':
        return (
          <ExercisePage onBack={() => setCurrentPage('home')} />
        );
      case 'chat':
        return (
          <ChatPage 
            onBack={() => setCurrentPage('home')} 
            userName={userData.personalInfo.name}
          />
        );
      case 'notifications':
        return (
          <div className="min-h-screen bg-gradient-background flex items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold mb-4">Notifications</h1>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-card rounded-lg border text-left">
                  <div className="font-medium text-energy">🌅 Good Morning!</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    "Today is yours to shape. Start with a deep breath and positive intention."
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">8:00 AM</div>
                </div>
                <div className="p-4 bg-card rounded-lg border text-left">
                  <div className="font-medium text-calm">🌙 Evening Reflection</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    "You did your best today. Take time to rest and recharge for tomorrow."
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">8:00 PM</div>
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('home')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen bg-gradient-background flex items-center justify-center">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold mb-4">Profile & Dashboard</h1>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-card rounded-lg border text-left">
                  <div className="font-medium">Welcome, {userData.personalInfo.name}!</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    User Type: {userData.userType}<br />
                    Stress Level: {userData.stressLevel}<br />
                    Goals: {userData.goals.join(', ')}
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg border text-left">
                  <div className="font-medium text-wellness">Wellness Stats</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    • Daily check-ins: 7 days<br />
                    • Meditation minutes: 45 min<br />
                    • Tasks completed: 12
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentPage('home')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return (
          <HomePage 
            userName={userData.personalInfo.name} 
            onNavigate={handleNavigation}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderCurrentPage()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;