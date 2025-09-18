import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward, Zap } from 'lucide-react';

interface StretchSessionProps {
  onBack: () => void;
  exercise: {
    title: string;
    duration: string;
    description: string;
    stretches: {
      name: string;
      duration: number;
      instruction: string;
      animation: string;
      targetArea: string;
      intensity: 'light' | 'moderate' | 'deep';
    }[];
  };
}

const StretchSession = ({ onBack, exercise }: StretchSessionProps) => {
  const [currentStretchIndex, setCurrentStretchIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.stretches[0]?.duration || 30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stretchIntensity, setStretchIntensity] = useState(1);

  const currentStretch = exercise.stretches[currentStretchIndex];
  const progress = ((currentStretch?.duration - timeRemaining) / currentStretch?.duration) * 100;
  const totalProgress = ((currentStretchIndex * 100) + progress) / exercise.stretches.length;

  // Stretch intensity animation
  useEffect(() => {
    let intensityInterval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      intensityInterval = setInterval(() => {
        setStretchIntensity(prev => {
          // Gradually increase intensity throughout the stretch
          const progressRatio = 1 - (timeRemaining / currentStretch?.duration);
          return 1 + (progressRatio * 0.3); // Scale from 1 to 1.3
        });
      }, 1000);
    }

    return () => clearInterval(intensityInterval);
  }, [isActive, isPaused, timeRemaining, currentStretch?.duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            if (currentStretchIndex < exercise.stretches.length - 1) {
              setCurrentStretchIndex(prev => prev + 1);
              return exercise.stretches[currentStretchIndex + 1].duration;
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
  }, [isActive, isPaused, timeRemaining, currentStretchIndex, exercise.stretches]);

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
    setCurrentStretchIndex(0);
    setTimeRemaining(exercise.stretches[0]?.duration || 30);
    setStretchIntensity(1);
  };

  const handleNextStretch = () => {
    if (currentStretchIndex < exercise.stretches.length - 1) {
      setCurrentStretchIndex(prev => prev + 1);
      setTimeRemaining(exercise.stretches[currentStretchIndex + 1].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'light': return 'text-green-500 bg-green-100';
      case 'moderate': return 'text-yellow-500 bg-yellow-100';
      case 'deep': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStretchAnimation = () => {
    const baseScale = stretchIntensity;
    const pulse = isActive && !isPaused ? 'animate-pulse' : '';
    return {
      transform: `scale(${baseScale})`,
      transition: 'transform 1s ease-in-out'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-wellness">
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
                <span className="text-sm font-medium">Stretch Session Progress</span>
                <span className="text-sm text-muted-foreground">
                  Stretch {currentStretchIndex + 1} of {exercise.stretches.length}
                </span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Animation Area */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Stretch Animation */}
              <div className="relative w-80 h-80 mx-auto mb-6">
                <div 
                  className="w-full h-full rounded-full bg-gradient-to-br from-wellness/20 to-calm/20 flex items-center justify-center transition-all duration-1000"
                  style={{
                    ...getStretchAnimation(),
                    boxShadow: isActive && !isPaused ? '0 0 50px rgba(34, 197, 94, 0.4)' : 'none'
                  }}
                >
                  {/* Stretch Character */}
                  <div className="text-center">
                    <div className="text-9xl mb-4 animate-fade-in">
                      {currentStretch?.animation}
                    </div>
                    <div className="text-2xl font-bold text-wellness mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    {isActive && !isPaused && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Deepening stretch...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Stretch Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <h2 className="text-3xl font-bold text-wellness">{currentStretch?.name}</h2>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${getIntensityColor(currentStretch?.intensity)}`}>
                    {currentStretch?.intensity}
                  </span>
                </div>
                <div className="text-lg font-medium text-primary mb-2">
                  Target: {currentStretch?.targetArea}
                </div>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {currentStretch?.instruction}
                </p>
                <div className="text-sm text-muted-foreground italic">
                  Hold this position and breathe deeply. Feel the gentle stretch.
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
                  className="bg-gradient-wellness hover:opacity-90 px-8"
                >
                  {isActive && !isPaused ? (
                    <><Pause className="w-5 h-5 mr-2" /> Pause</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" /> {isActive ? 'Resume' : 'Start'}</>
                  )}
                </Button>

                <Button
                  onClick={handleNextStretch}
                  variant="outline"
                  size="lg"
                  disabled={currentStretchIndex >= exercise.stretches.length - 1}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Next
                </Button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-wellness">{currentStretchIndex + 1}</div>
                  <div className="text-sm text-muted-foreground">Current Stretch</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-calm">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-energy">{Math.round(totalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{exercise.stretches.length}</div>
                  <div className="text-sm text-muted-foreground">Total Stretches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stretch Sequence */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Stretch Sequence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.stretches.map((stretch, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${
                      index === currentStretchIndex 
                        ? 'bg-wellness/10 border-l-4 border-wellness shadow-medium' 
                        : index < currentStretchIndex 
                        ? 'bg-green-50 opacity-70' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentStretchIndex(index);
                      setTimeRemaining(stretch.duration);
                    }}
                  >
                    <div className="text-3xl mr-4">{stretch.animation}</div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center space-x-2">
                        <span>{stretch.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getIntensityColor(stretch.intensity)}`}>
                          {stretch.intensity}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{stretch.targetArea}</div>
                      <div className="text-xs text-muted-foreground">{stretch.instruction}</div>
                    </div>
                    <div className="text-sm font-medium text-wellness">
                      {formatTime(stretch.duration)}
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

export default StretchSession;