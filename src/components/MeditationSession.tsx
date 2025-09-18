import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface MeditationSessionProps {
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
    }[];
  };
}

const MeditationSession = ({ onBack, exercise }: MeditationSessionProps) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.poses[0]?.duration || 30);
  const [totalTime, setTotalTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentPose = exercise.poses[currentPoseIndex];
  const progress = ((currentPose?.duration - timeRemaining) / currentPose?.duration) * 100;
  const totalProgress = ((currentPoseIndex * 100) + progress) / exercise.poses.length;

  useEffect(() => {
    const total = exercise.poses.reduce((sum, pose) => sum + pose.duration, 0);
    setTotalTime(total);
  }, [exercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            // Move to next pose
            if (currentPoseIndex < exercise.poses.length - 1) {
              setCurrentPoseIndex(prev => prev + 1);
              return exercise.poses[currentPoseIndex + 1].duration;
            } else {
              // Session complete
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
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
                <span className="text-sm font-medium">Session Progress</span>
                <span className="text-sm text-muted-foreground">
                  {currentPoseIndex + 1} of {exercise.poses.length}
                </span>
              </div>
              <Progress value={totalProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Main Animation Area */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-8 text-center">
              {/* Animated Character */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <div 
                  className={`w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-wellness/20 flex items-center justify-center transition-all duration-1000 ${
                    isActive && !isPaused ? 'animate-pulse' : ''
                  }`}
                  style={{
                    transform: isActive && !isPaused ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isActive && !isPaused ? '0 0 40px rgba(147, 197, 253, 0.4)' : 'none'
                  }}
                >
                  {/* Meditation Character Animation */}
                  <div className="text-center">
                    <div className="text-8xl mb-4 animate-fade-in">{currentPose?.animation}</div>
                    <div className="text-xl font-bold text-primary">
                      {formatTime(timeRemaining)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Pose Info */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">{currentPose?.name}</h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {currentPose?.instruction}
                </p>
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
                  className="flex-1 max-w-32"
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
                  onClick={() => setCurrentPoseIndex(Math.min(currentPoseIndex + 1, exercise.poses.length - 1))}
                  variant="outline"
                  size="lg"
                  className="flex-1 max-w-32"
                  disabled={currentPoseIndex >= exercise.poses.length - 1}
                >
                  Next
                </Button>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-wellness">{currentPoseIndex + 1}</div>
                  <div className="text-sm text-muted-foreground">Current Pose</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-calm">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-energy">{Math.round(totalProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pose List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Session Overview</h3>
              <div className="space-y-3">
                {exercise.poses.map((pose, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      index === currentPoseIndex 
                        ? 'bg-primary/10 border-l-4 border-primary' 
                        : index < currentPoseIndex 
                        ? 'bg-green-50 opacity-60' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mr-4">{pose.animation}</div>
                    <div className="flex-1">
                      <div className="font-medium">{pose.name}</div>
                      <div className="text-sm text-muted-foreground">{pose.instruction}</div>
                    </div>
                    <div className="text-sm font-medium text-primary">
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

export default MeditationSession;