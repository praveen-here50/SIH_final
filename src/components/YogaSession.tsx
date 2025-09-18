import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

interface YogaSessionProps {
  onBack: () => void;
  exercise: {
    title: string;
    duration: string;
    description: string;
    poses: {
      name: string;
      duration: number;
      instruction: string;
      animation: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }[];
  };
}

const YogaSession = ({ onBack, exercise }: YogaSessionProps) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.poses[0]?.duration || 30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'in' | 'hold' | 'out'>('in');

  const currentPose = exercise.poses[currentPoseIndex];
  const progress = ((currentPose?.duration - timeRemaining) / currentPose?.duration) * 100;
  const totalProgress = ((currentPoseIndex * 100) + progress) / exercise.poses.length;

  // Breathing animation cycle
  useEffect(() => {
    let breathingInterval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      breathingInterval = setInterval(() => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'in': return 'hold';
            case 'hold': return 'out';
            case 'out': return 'in';
            default: return 'in';
          }
        });
      }, 3000); // 3-second breathing cycle
    }

    return () => clearInterval(breathingInterval);
  }, [isActive, isPaused]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            if (currentPoseIndex < exercise.poses.length - 1) {
              setCurrentPoseIndex(prev => prev + 1);
              return exercise.poses[currentPoseIndex + 1].duration;
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
  }, [isActive, isPaused, timeRemaining, currentPoseIndex, exercise.poses]);

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
    setCurrentPoseIndex(0);
    setTimeRemaining(exercise.poses[0]?.duration || 30);
  };

  const handleNextPose = () => {
    if (currentPoseIndex < exercise.poses.length - 1) {
      setCurrentPoseIndex(prev => prev + 1);
      setTimeRemaining(exercise.poses[currentPoseIndex + 1].duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'in': return 1.1;
      case 'hold': return 1.1;
      case 'out': return 0.95;
      default: return 1;
    }
  };

  const getBreathingText = () => {
    switch (breathingPhase) {
      case 'in': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'out': return 'Breathe Out';
      default: return 'Breathe';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-energy">
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
                <span className="text-sm font-medium">Yoga Session Progress</span>
                <span className="text-sm text-muted-foreground">
                  Pose {currentPoseIndex + 1} of {exercise.poses.length}
                </span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Animation Area */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Yoga Pose Animation */}
              <div className="relative w-80 h-80 mx-auto mb-6">
                <div 
                  className="w-full h-full rounded-full bg-gradient-to-br from-energy/20 to-wellness/20 flex items-center justify-center transition-all duration-3000 ease-in-out"
                  style={{
                    transform: `scale(${getBreathingScale()})`,
                    boxShadow: isActive && !isPaused ? '0 0 60px rgba(251, 191, 36, 0.4)' : 'none'
                  }}
                >
                  {/* Yoga Character */}
                  <div className="text-center">
                    <div className="text-9xl mb-4 animate-fade-in transform transition-transform duration-1000">
                      {currentPose?.animation}
                    </div>
                    <div className="text-2xl font-bold text-energy mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    {isActive && !isPaused && (
                      <div className="text-sm text-muted-foreground animate-pulse">
                        {getBreathingText()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Pose Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <h2 className="text-3xl font-bold text-energy">{currentPose?.name}</h2>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full bg-gray-100 ${getDifficultyColor(currentPose?.difficulty)}`}>
                    {currentPose?.difficulty}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {currentPose?.instruction}
                </p>
                <div className="text-sm text-muted-foreground italic">
                  Focus on your breathing and hold the pose steadily
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
                  className="bg-gradient-energy hover:opacity-90 px-8"
                >
                  {isActive && !isPaused ? (
                    <><Pause className="w-5 h-5 mr-2" /> Pause</>
                  ) : (
                    <><Play className="w-5 h-5 mr-2" /> {isActive ? 'Resume' : 'Start'}</>
                  )}
                </Button>

                <Button
                  onClick={handleNextPose}
                  variant="outline"
                  size="lg"
                  disabled={currentPoseIndex >= exercise.poses.length - 1}
                >
                  <SkipForward className="w-5 h-5 mr-2" />
                  Next
                </Button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-energy">{currentPoseIndex + 1}</div>
                  <div className="text-sm text-muted-foreground">Current Pose</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-wellness">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-calm">{Math.round(totalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{exercise.poses.length}</div>
                  <div className="text-sm text-muted-foreground">Total Poses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pose Sequence */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Yoga Sequence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.poses.map((pose, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-4 rounded-lg transition-all cursor-pointer ${
                      index === currentPoseIndex 
                        ? 'bg-energy/10 border-l-4 border-energy shadow-medium' 
                        : index < currentPoseIndex 
                        ? 'bg-green-50 opacity-70' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setCurrentPoseIndex(index);
                      setTimeRemaining(pose.duration);
                    }}
                  >
                    <div className="text-3xl mr-4">{pose.animation}</div>
                    <div className="flex-1">
                      <div className="font-medium flex items-center space-x-2">
                        <span>{pose.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(pose.difficulty)}`}>
                          {pose.difficulty}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{pose.instruction}</div>
                    </div>
                    <div className="text-sm font-medium text-energy">
                      {formatTime(pose.duration)}
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

export default YogaSession;