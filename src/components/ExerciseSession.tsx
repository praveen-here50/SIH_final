import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Timer } from 'lucide-react';

interface ExerciseSessionProps {
  onBack: () => void;
  exercise: {
    title: string;
    duration: string;
    description: string;
    category: string;
    difficulty: string;
    steps: {
      name: string;
      duration: number;
      instruction: string;
      animation: string;
      type: 'breathing' | 'movement' | 'focus' | 'relaxation';
    }[];
  };
}

const ExerciseSession = ({ onBack, exercise }: ExerciseSessionProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.steps[0]?.duration || 30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'active' | 'rest'>('active');

  const currentStep = exercise.steps[currentStepIndex];
  const progress = ((currentStep?.duration - timeRemaining) / currentStep?.duration) * 100;
  const totalProgress = ((currentStepIndex * 100) + progress) / exercise.steps.length;

  // Animation cycle for different exercise types
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    
    if (isActive && !isPaused && currentStep?.type === 'breathing') {
      animationInterval = setInterval(() => {
        setAnimationPhase(prev => prev === 'active' ? 'rest' : 'active');
      }, 2000); // 2-second breathing cycle
    } else if (isActive && !isPaused && currentStep?.type === 'movement') {
      animationInterval = setInterval(() => {
        setAnimationPhase(prev => prev === 'active' ? 'rest' : 'active');
      }, 1500); // 1.5-second movement cycle
    }

    return () => clearInterval(animationInterval);
  }, [isActive, isPaused, currentStep?.type]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            if (currentStepIndex < exercise.steps.length - 1) {
              setCurrentStepIndex(prev => prev + 1);
              return exercise.steps[currentStepIndex + 1].duration;
            } else {
              setIsActive(false);
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, currentStepIndex, exercise.steps]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setTimeRemaining(exercise.steps[0]?.duration || 30);
  };

  const handleNextStep = () => {
    if (currentStepIndex < exercise.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setTimeRemaining(exercise.steps[currentStepIndex + 1].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAnimationScale = () => {
    if (!isActive || isPaused) return 1;
    
    switch (currentStep?.type) {
      case 'breathing':
        return animationPhase === 'active' ? 1.15 : 0.9;
      case 'movement':
        return animationPhase === 'active' ? 1.1 : 1;
      case 'focus':
        return 1.05;
      default:
        return 1;
    }
  };

  const getAnimationText = () => {
    if (!isActive || isPaused) return 'Ready to begin';
    
    switch (currentStep?.type) {
      case 'breathing':
        return animationPhase === 'active' ? 'Breathe In' : 'Breathe Out';
      case 'movement':
        return animationPhase === 'active' ? 'Move' : 'Hold';
      case 'focus':
        return 'Focus & Concentrate';
      case 'relaxation':
        return 'Relax & Release';
      default:
        return 'Follow the instructions';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'breathing': return 'text-blue-500';
      case 'movement': return 'text-green-500';
      case 'focus': return 'text-purple-500';
      case 'relaxation': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{exercise.title}</h1>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Exercise Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} of {exercise.steps.length}
                </span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Animation Area */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Exercise Animation */}
              <div className="relative w-80 h-80 mx-auto mb-6">
                <div 
                  className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center transition-all duration-2000 ease-in-out"
                  style={{
                    transform: `scale(${getAnimationScale()})`,
                    boxShadow: isActive && !isPaused ? '0 0 60px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                >
                  {/* Exercise Character/Icon */}
                  <div className="text-center">
                    <div className="text-9xl mb-4 animate-fade-in transform transition-transform duration-1000">
                      {currentStep?.animation}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    {isActive && !isPaused && (
                      <div className="text-sm text-muted-foreground animate-pulse">
                        {getAnimationText()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Step Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <h2 className="text-3xl font-bold text-primary">{currentStep?.name}</h2>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full bg-gray-100 ${getTypeColor(currentStep?.type)}`}>
                    {currentStep?.type}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {currentStep?.instruction}
                </p>
                <div className="text-sm text-muted-foreground italic">
                  Follow the guidance and maintain steady breathing
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center space-x-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
                
                <Button
                  onClick={isActive ? handlePause : handleStart}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 px-8"
                >
                  {isActive && !isPaused ? (
                    <><Pause className="w-5 h-5 mr-2" /> Pause</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" /> {isActive ? 'Resume' : 'Start'}</>
                  )}
                </Button>

                <Button
                  onClick={handleNextStep}
                  variant="outline"
                  size="lg"
                  disabled={currentStepIndex >= exercise.steps.length - 1}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Next
                </Button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{currentStepIndex + 1}</div>
                  <div className="text-sm text-muted-foreground">Current Step</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{Math.round(totalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{exercise.steps.length}</div>
                  <div className="text-sm text-muted-foreground">Total Steps</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Sequence */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Exercise Sequence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${
                      index === currentStepIndex 
                        ? 'bg-primary/10 border-l-4 border-primary shadow-medium' 
                        : index < currentStepIndex 
                        ? 'bg-green-50 opacity-70' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentStepIndex(index);
                      setTimeRemaining(step.duration);
                    }}
                  >
                    <div className="text-3xl mr-4">{step.animation}</div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center space-x-2">
                        <span>{step.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(step.type)}`}>
                          {step.type}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{step.instruction}</div>
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {formatTime(step.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ExerciseSession;