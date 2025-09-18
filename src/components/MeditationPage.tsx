import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Flower2,
  Brain,
  Dumbbell
} from 'lucide-react';
import MeditationSession from './MeditationSession';
import YogaSession from './YogaSession';
import StretchSession from './StretchSession';

interface MeditationPageProps {
  onBack: () => void;
}

const MeditationPage = ({ onBack }: MeditationPageProps) => {
  const [activeSection, setActiveSection] = useState<'breathing' | 'meditation' | 'yoga' | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  
  // Breathing Exercise State
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-hold)
  const breathingPattern = {
    inhale: 4,
    hold: 4, 
    exhale: 4,
    pause: 4
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathingActive && activeSection === 'breathing') {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          const newTimer = prev + 1;
          const currentPhaseDuration = breathingPattern[breathingPhase];
          
          if (newTimer >= currentPhaseDuration) {
            // Move to next phase
            switch (breathingPhase) {
              case 'inhale':
                setBreathingPhase('hold');
                break;
              case 'hold':
                setBreathingPhase('exhale');
                break;
              case 'exhale':
                setBreathingPhase('pause');
                break;
              case 'pause':
                setBreathingPhase('inhale');
                setBreathingCycle(c => c + 1);
                break;
            }
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase, activeSection]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setBreathingTimer(0);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('pause');
    setBreathingTimer(0);
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('pause');
    setBreathingTimer(0);
    setBreathingCycle(0);
  };

  const getBreathingScale = () => {
    const progress = breathingTimer / breathingPattern[breathingPhase];
    switch (breathingPhase) {
      case 'inhale':
        return 1 + (progress * 0.5); // Scale from 1 to 1.5
      case 'hold':
        return 1.5; // Stay at 1.5
      case 'exhale':
        return 1.5 - (progress * 0.5); // Scale from 1.5 to 1
      case 'pause':
        return 1; // Stay at 1
      default:
        return 1;
    }
  };

  const getPhaseText = () => {
    switch (breathingPhase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      case 'pause': return 'Pause...';
      default: return 'Ready to begin';
    }
  };

  const meditationExercises = [
    {
      title: "Mindfulness Meditation",
      duration: "10 min",
      description: "Focus on the present moment and observe your thoughts without judgment",
      image: "🧘‍♀️",
      poses: [
        { name: "Settling In", duration: 60, instruction: "Find a comfortable seated position. Close your eyes gently.", animation: "🧘‍♀️" },
        { name: "Breath Awareness", duration: 180, instruction: "Focus on your natural breath. Notice each inhale and exhale.", animation: "🌬️" },
        { name: "Thought Observation", duration: 240, instruction: "When thoughts arise, acknowledge them without judgment and return to breath.", animation: "💭" },
        { name: "Body Awareness", duration: 120, instruction: "Expand awareness to include bodily sensations.", animation: "✨" },
        { name: "Loving Presence", duration: 60, instruction: "Rest in open, loving awareness. Simply be present.", animation: "💝" }
      ]
    },
    {
      title: "Body Scan",
      duration: "15 min", 
      description: "Progressive relaxation focusing on different parts of your body",
      image: "✨",
      poses: [
        { name: "Ground & Center", duration: 60, instruction: "Lie down comfortably. Take three deep breaths.", animation: "🛌" },
        { name: "Feet & Legs", duration: 180, instruction: "Focus on your feet, ankles, calves, and thighs. Release tension.", animation: "🦵" },
        { name: "Torso Scan", duration: 240, instruction: "Move attention to hips, abdomen, chest. Soften each area.", animation: "🫁" },
        { name: "Arms & Hands", duration: 180, instruction: "Notice shoulders, arms, hands. Let them completely relax.", animation: "🤲" },
        { name: "Head & Face", duration: 180, instruction: "Relax forehead, eyes, jaw. Release all facial tension.", animation: "😌" },
        { name: "Whole Body", duration: 120, instruction: "Feel your entire body as one unified, relaxed being.", animation: "✨" }
      ]
    },
    {
      title: "Loving Kindness",
      duration: "12 min",
      description: "Cultivate compassion and positive feelings towards yourself and others",
      image: "💝",
      poses: [
        { name: "Self Love", duration: 180, instruction: "Send loving wishes to yourself: 'May I be happy, may I be peaceful.'", animation: "💝" },
        { name: "Loved Ones", duration: 180, instruction: "Bring someone you love to mind. Send them warm wishes.", animation: "🤗" },
        { name: "Neutral Person", duration: 120, instruction: "Think of someone neutral. Extend the same loving wishes.", animation: "👤" },
        { name: "Difficult Person", duration: 120, instruction: "Gently include someone challenging. Wish them well.", animation: "🕊️" },
        { name: "All Beings", duration: 120, instruction: "Expand to include all living beings everywhere.", animation: "🌍" },
        { name: "Integration", duration: 60, instruction: "Rest in the warm glow of universal loving kindness.", animation: "☀️" }
      ]
    }
  ];

  const yogaExercises = [
    {
      title: "Morning Energizer",
      duration: "20 min",
      description: "Gentle yoga poses to start your day with energy and calm",
      image: "🌅",
      poses: [
        { name: "Child's Pose", duration: 60, instruction: "Kneel and sit back on your heels, arms extended forward.", animation: "🧘‍♀️", difficulty: "easy" },
        { name: "Cat-Cow Stretch", duration: 90, instruction: "On hands and knees, alternate between arching and rounding your spine.", animation: "🐱", difficulty: "easy" },
        { name: "Downward Dog", duration: 120, instruction: "Form an inverted V-shape, stretching through your spine.", animation: "🐕", difficulty: "medium" },
        { name: "Standing Forward Fold", duration: 90, instruction: "Bend forward from your hips, let your arms hang freely.", animation: "🙇‍♀️", difficulty: "easy" },
        { name: "Warrior I", duration: 120, instruction: "Step back into a lunge, raise arms overhead with confidence.", animation: "🏹", difficulty: "medium" },
        { name: "Tree Pose", duration: 90, instruction: "Balance on one foot, place other foot on inner thigh.", animation: "🌳", difficulty: "medium" },
        { name: "Savasana", duration: 180, instruction: "Lie flat, completely relax, and integrate your practice.", animation: "😴", difficulty: "easy" }
      ]
    },
    {
      title: "Stress Relief Flow",
      duration: "25 min",
      description: "Flowing movements designed to release tension and anxiety",
      image: "🌊",
      poses: [
        { name: "Gentle Neck Rolls", duration: 60, instruction: "Slowly roll your head to release neck tension.", animation: "🔄", difficulty: "easy" },
        { name: "Shoulder Shrugs", duration: 60, instruction: "Lift shoulders to ears, then release with a sigh.", animation: "🤷‍♀️", difficulty: "easy" },
        { name: "Spinal Waves", duration: 120, instruction: "Create gentle waves through your spine, seated or standing.", animation: "🌊", difficulty: "easy" },
        { name: "Pigeon Pose", duration: 180, instruction: "Open your hips deeply, breathe into any resistance.", animation: "🕊️", difficulty: "medium" },
        { name: "Seated Twist", duration: 120, instruction: "Gently rotate your spine, releasing tension from your back.", animation: "🌪️", difficulty: "easy" },
        { name: "Legs Up Wall", duration: 300, instruction: "Lie with legs up against a wall, completely surrender.", animation: "🧘‍♀️", difficulty: "easy" },
        { name: "Final Rest", duration: 240, instruction: "Rest in complete stillness, feeling stress melt away.", animation: "😌", difficulty: "easy" }
      ]
    },
    {
      title: "Gentle Stretching",
      duration: "15 min",
      description: "Relaxing stretches to prepare your body and mind for rest",
      image: "🌙",
      stretches: [
        { name: "Neck Side Stretch", duration: 45, instruction: "Gently tilt head to each side, feeling the stretch along your neck.", animation: "👤", targetArea: "Neck & Shoulders", intensity: "light" },
        { name: "Shoulder Rolls", duration: 60, instruction: "Roll shoulders backwards in large, slow circles.", animation: "🔄", targetArea: "Shoulders", intensity: "light" },
        { name: "Seated Spinal Twist", duration: 90, instruction: "Sit cross-legged, gently twist your torso to each side.", animation: "🌪️", targetArea: "Spine & Core", intensity: "moderate" },
        { name: "Forward Fold", duration: 120, instruction: "Sitting with legs extended, gently reach toward your toes.", animation: "🙇‍♀️", targetArea: "Hamstrings & Back", intensity: "moderate" },
        { name: "Hip Flexor Stretch", duration: 90, instruction: "In a lunge position, feel the stretch in your hip flexors.", animation: "🦵", targetArea: "Hips & Thighs", intensity: "moderate" },
        { name: "Calf Stretch", duration: 60, instruction: "Place hands against wall, step back and stretch your calves.", animation: "🧘‍♂️", targetArea: "Calves", intensity: "light" },
        { name: "Gentle Backbend", duration: 75, instruction: "Lie on your back, gently arch into a supported backbend.", animation: "🌙", targetArea: "Chest & Spine", intensity: "light" },
        { name: "Final Relaxation", duration: 180, instruction: "Lie in comfortable position, let your whole body soften.", animation: "😴", targetArea: "Full Body", intensity: "light" }
      ]
    }
  ];

  // Handle session navigation
  if (selectedExercise) {
    if (selectedExercise.poses) {
      if (selectedExercise.title.includes('Energizer') || selectedExercise.title.includes('Stress Relief')) {
        return <YogaSession exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
      } else {
        return <MeditationSession exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
      }
    } else if (selectedExercise.stretches) {
      return <StretchSession exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
    }
  }

  if (activeSection === 'breathing') {
    return (
      <div className="min-h-screen bg-gradient-calm">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setActiveSection(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Breathing Exercise</h1>
                <p className="text-sm text-muted-foreground">4-4-4-4 Breathing Pattern</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto space-y-8">
            {/* Breathing Circle */}
            <div className="relative">
              <div 
                className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-wellness/30 border-4 border-primary/50 transition-transform duration-1000 ease-in-out flex items-center justify-center"
                style={{ 
                  transform: `scale(${getBreathingScale()})`,
                  boxShadow: isBreathingActive ? '0 0 40px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {breathingPattern[breathingPhase] - breathingTimer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getPhaseText()}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-wellness">{breathingCycle}</div>
                <div className="text-sm text-muted-foreground">Cycles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-calm">{Math.floor(breathingCycle * 16 / 60)}</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={isBreathingActive ? stopBreathing : startBreathing}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                {isBreathingActive ? (
                  <><Pause className="w-5 h-5 mr-2" /> Pause</>
                ) : (
                  <><Play className="w-5 h-5 mr-2" /> Start</>
                )}
              </Button>
              <Button
                onClick={resetBreathing}
                size="lg"
                variant="outline"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Reset
              </Button>
            </div>

            {/* Instructions */}
            <Card className="text-left">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">How it works:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Inhale slowly for 4 seconds</li>
                  <li>• Hold your breath for 4 seconds</li>
                  <li>• Exhale slowly for 4 seconds</li>
                  <li>• Pause for 4 seconds before repeating</li>
                </ul>
                <p className="text-xs text-muted-foreground mt-4">
                  This technique helps activate your parasympathetic nervous system, reducing stress and anxiety.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Meditation & Relaxation</h1>
              <p className="text-sm text-muted-foreground">
                Find peace through breathing, meditation, and yoga
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Breathing Exercise Section */}
          <Card 
            className="cursor-pointer hover:shadow-glow transition-all hover:scale-105 animate-fade-in"
            onClick={() => setActiveSection('breathing')}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Flower2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Breathing Exercise</CardTitle>
              <p className="text-muted-foreground">
                Interactive breathing guide with visual cues
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Start Breathing Exercise
              </Button>
            </CardContent>
          </Card>

          {/* Meditation Section */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-calm rounded-full flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Guided Meditation</CardTitle>
              <p className="text-muted-foreground">
                Calming meditation sessions for inner peace
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {meditationExercises.map((exercise, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all cursor-pointer">
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="text-3xl">{exercise.image}</div>
                      <div>
                        <h4 className="font-semibold">{exercise.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                        <div className="text-xs text-primary font-medium">{exercise.duration}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Yoga Section */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-energy rounded-full flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Yoga & Stretching</CardTitle>
              <p className="text-muted-foreground">
                Gentle movements to release tension and improve flexibility
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {yogaExercises.map((exercise, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all cursor-pointer">
                    <CardContent className="p-4 text-center space-y-3">
                      <div className="text-3xl">{exercise.image}</div>
                      <div>
                        <h4 className="font-semibold">{exercise.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                        <div className="text-xs text-energy font-medium">{exercise.duration}</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        Start Practice
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MeditationPage;