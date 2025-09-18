import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Timer, 
  Target, 
  Brain,
  Zap,
  Smile,
  Activity
} from 'lucide-react';
import ExerciseSession from './ExerciseSession';

interface Exercise {
  id: string;
  title: string;
  category: 'stress-relief' | 'concentration' | 'both';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  benefits: string[];
  instructions: string[];
  image: string;
  steps: {
    name: string;
    duration: number;
    instruction: string;
    animation: string;
    type: 'breathing' | 'movement' | 'focus' | 'relaxation';
  }[];
}

interface ExercisePageProps {
  onBack: () => void;
}

const ExercisePage = ({ onBack }: ExercisePageProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stress-relief' | 'concentration'>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showSession, setShowSession] = useState(false);

  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'Progressive Muscle Relaxation',
      category: 'stress-relief',
      duration: '10-15 min',
      difficulty: 'Easy',
      description: 'Systematically tense and release muscle groups to reduce physical tension',
      benefits: ['Reduces muscle tension', 'Lowers stress hormones', 'Improves sleep quality'],
      instructions: [
        'Find a comfortable position lying down or sitting',
        'Start with your toes - tense for 5 seconds, then release',
        'Move up through each muscle group: calves, thighs, abdomen',
        'Continue with arms, shoulders, neck, and face',
        'Notice the contrast between tension and relaxation',
        'End with 2-3 minutes of deep breathing'
      ],
      image: '🧘‍♂️',
      steps: [
        { name: 'Preparation', duration: 60, instruction: 'Find a comfortable position and close your eyes', animation: '🧘‍♂️', type: 'relaxation' },
        { name: 'Feet Tension', duration: 45, instruction: 'Tense your feet and toes, hold for 5 seconds', animation: '🦶', type: 'movement' },
        { name: 'Leg Tension', duration: 45, instruction: 'Tense your calves and thighs, feel the tension', animation: '🦵', type: 'movement' },
        { name: 'Core Tension', duration: 45, instruction: 'Tighten your abdomen and lower back muscles', animation: '💪', type: 'movement' },
        { name: 'Arm Tension', duration: 45, instruction: 'Make fists and tense your arms and shoulders', animation: '💪', type: 'movement' },
        { name: 'Face Tension', duration: 45, instruction: 'Scrunch your face muscles, then release', animation: '😤', type: 'movement' },
        { name: 'Full Body Release', duration: 90, instruction: 'Release all tension and breathe deeply', animation: '😌', type: 'relaxation' },
        { name: 'Final Relaxation', duration: 120, instruction: 'Enjoy the feeling of complete relaxation', animation: '🕯️', type: 'relaxation' }
      ]
    },
    {
      id: '2',
      title: 'Focus Pyramid Exercise',
      category: 'concentration',
      duration: '5-10 min',
      difficulty: 'Medium',
      description: 'Build concentration skills through structured attention training',
      benefits: ['Improves focus span', 'Enhances working memory', 'Reduces mind wandering'],
      instructions: [
        'Choose a simple object (pen, book, etc.)',
        'Focus on the object for 30 seconds',
        'Add details: color, texture, weight',
        'Increase focus time to 1 minute, then 2 minutes',
        'When mind wanders, gently return attention to object',
        'Build up to 5-10 minutes of sustained focus'
      ],
      image: '🎯',
      steps: [
        { name: 'Object Selection', duration: 30, instruction: 'Choose a simple object to focus on', animation: '👁️', type: 'focus' },
        { name: 'Initial Focus', duration: 30, instruction: 'Look at the object, notice its basic shape', animation: '🎯', type: 'focus' },
        { name: 'Detail Observation', duration: 60, instruction: 'Observe color, texture, and shadows', animation: '🔍', type: 'focus' },
        { name: 'Deep Focus Level 1', duration: 60, instruction: 'Maintain attention for 1 minute', animation: '🧠', type: 'focus' },
        { name: 'Deep Focus Level 2', duration: 120, instruction: 'Extend focus to 2 minutes', animation: '🎯', type: 'focus' },
        { name: 'Advanced Focus', duration: 180, instruction: 'Challenge yourself with 3 minutes', animation: '💎', type: 'focus' },
        { name: 'Integration', duration: 60, instruction: 'Reflect on your focus experience', animation: '🧘', type: 'relaxation' }
      ]
    },
    {
      id: '3',
      title: 'Stress-Relief Stretching',
      category: 'stress-relief',
      duration: '8-12 min',
      difficulty: 'Easy',
      description: 'Gentle stretches to release tension in common stress areas',
      benefits: ['Releases muscle tension', 'Improves circulation', 'Calms nervous system'],
      instructions: [
        'Neck rolls: Slowly roll head in circles (5 each direction)',
        'Shoulder shrugs: Lift shoulders to ears, hold 5 seconds, release',
        'Cat-cow stretch: On hands and knees, arch and round spine',
        'Seated spinal twist: Gentle rotation left and right',
        'Ankle circles: Improve circulation in legs',
        'End with gentle deep breathing'
      ],
      image: '🤸‍♀️',
      steps: [
        { name: 'Warm-up Breathing', duration: 30, instruction: 'Take 5 deep breaths to center yourself', animation: '🫁', type: 'breathing' },
        { name: 'Neck Circles', duration: 45, instruction: 'Slowly roll your neck in circles', animation: '🔄', type: 'movement' },
        { name: 'Shoulder Rolls', duration: 45, instruction: 'Roll shoulders backward and forward', animation: '🤸‍♀️', type: 'movement' },
        { name: 'Side Stretch', duration: 60, instruction: 'Stretch your arms overhead and lean side to side', animation: '🙆‍♀️', type: 'movement' },
        { name: 'Spinal Twist', duration: 60, instruction: 'Gentle seated twist to both sides', animation: '🌪️', type: 'movement' },
        { name: 'Leg Stretch', duration: 45, instruction: 'Stretch your legs and rotate ankles', animation: '🦵', type: 'movement' },
        { name: 'Cool Down', duration: 60, instruction: 'Return to center and breathe deeply', animation: '😌', type: 'breathing' }
      ]
    },
    {
      id: '4',
      title: 'Mindful Walking',
      category: 'both',
      duration: '10-20 min',
      difficulty: 'Easy',
      description: 'Combine physical movement with mindfulness for dual benefits',
      benefits: ['Reduces stress', 'Improves focus', 'Boosts mood', 'Increases energy'],
      instructions: [
        'Find a quiet path or space for walking',
        'Start walking at a slower pace than usual',
        'Focus on the sensation of feet touching ground',
        'Notice your breathing rhythm with steps',
        'Observe surroundings without judgment',
        'When mind wanders, return focus to walking sensations'
      ],
      image: '🚶‍♀️',
      steps: [
        { name: 'Standing Preparation', duration: 60, instruction: 'Stand still and feel your feet on the ground', animation: '🧍‍♀️', type: 'focus' },
        { name: 'First Steps', duration: 120, instruction: 'Begin walking very slowly', animation: '🚶‍♀️', type: 'movement' },
        { name: 'Foot Awareness', duration: 180, instruction: 'Focus on how each foot touches the ground', animation: '👟', type: 'focus' },
        { name: 'Breathing & Walking', duration: 240, instruction: 'Coordinate breathing with your steps', animation: '🫁', type: 'breathing' },
        { name: 'Environmental Awareness', duration: 180, instruction: 'Notice sounds, smells, and sights around you', animation: '👁️', type: 'focus' },
        { name: 'Mindful Pace', duration: 300, instruction: 'Continue at your mindful pace', animation: '🚶‍♀️', type: 'movement' },
        { name: 'Finishing Steps', duration: 60, instruction: 'Gradually slow down and come to a stop', animation: '🛑', type: 'relaxation' }
      ]
    },
    {
      id: '5',
      title: 'Box Breathing Focus',
      category: 'concentration',
      duration: '5-8 min',
      difficulty: 'Medium',
      description: 'Use structured breathing to enhance concentration and calmness',
      benefits: ['Improves focus', 'Reduces anxiety', 'Enhances decision-making'],
      instructions: [
        'Sit comfortably with straight posture',
        'Breathe in for 4 counts',
        'Hold breath for 4 counts',
        'Exhale for 4 counts',
        'Hold empty lungs for 4 counts',
        'Repeat for 5-10 cycles, maintaining focus on counting'
      ],
      image: '💨',
      steps: [
        { name: 'Posture Setup', duration: 30, instruction: 'Sit comfortably with straight spine', animation: '🧘‍♂️', type: 'focus' },
        { name: 'Practice Round', duration: 60, instruction: 'Try one complete box breathing cycle', animation: '🔄', type: 'breathing' },
        { name: 'Breathe In (4 counts)', duration: 32, instruction: 'Inhale slowly for 4 counts', animation: '⬆️', type: 'breathing' },
        { name: 'Hold (4 counts)', duration: 32, instruction: 'Hold your breath for 4 counts', animation: '⏸️', type: 'breathing' },
        { name: 'Breathe Out (4 counts)', duration: 32, instruction: 'Exhale slowly for 4 counts', animation: '⬇️', type: 'breathing' },
        { name: 'Hold Empty (4 counts)', duration: 32, instruction: 'Hold empty lungs for 4 counts', animation: '⏹️', type: 'breathing' },
        { name: 'Continuous Cycles', duration: 240, instruction: 'Continue the 4-4-4-4 pattern', animation: '🔄', type: 'breathing' },
        { name: 'Final Integration', duration: 60, instruction: 'Return to natural breathing', animation: '😌', type: 'relaxation' }
      ]
    },
    {
      id: '6',
      title: 'Gratitude & Positivity Practice',
      category: 'stress-relief',
      duration: '5-7 min',
      difficulty: 'Easy',
      description: 'Mental exercise to shift focus from stress to positive aspects',
      benefits: ['Reduces negative thinking', 'Improves mood', 'Builds resilience'],
      instructions: [
        'Sit quietly and take 3 deep breaths',
        'Think of 3 things you\'re grateful for today',
        'Reflect on each item for 30 seconds',
        'Think of 1 personal strength you have',
        'Recall 1 positive interaction from recent days',
        'End by setting a positive intention for the day'
      ],
      image: '😊',
      steps: [
        { name: 'Centering Breaths', duration: 45, instruction: 'Take 3 deep, calming breaths', animation: '🫁', type: 'breathing' },
        { name: 'Gratitude Item 1', duration: 60, instruction: 'Think of something you\'re grateful for', animation: '🙏', type: 'focus' },
        { name: 'Gratitude Item 2', duration: 60, instruction: 'Reflect on a second thing you appreciate', animation: '💝', type: 'focus' },
        { name: 'Gratitude Item 3', duration: 60, instruction: 'Consider a third blessing in your life', animation: '✨', type: 'focus' },
        { name: 'Personal Strength', duration: 60, instruction: 'Acknowledge one of your strengths', animation: '💪', type: 'focus' },
        { name: 'Positive Memory', duration: 60, instruction: 'Recall a recent positive interaction', animation: '😊', type: 'focus' },
        { name: 'Positive Intention', duration: 60, instruction: 'Set a positive intention for today', animation: '🌟', type: 'focus' },
        { name: 'Closing Gratitude', duration: 30, instruction: 'End with a feeling of appreciation', animation: '🤗', type: 'relaxation' }
      ]
    }
  ];

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory || ex.category === 'both');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stress-relief': return <Smile className="w-4 h-4" />;
      case 'concentration': return <Brain className="w-4 h-4" />;
      case 'both': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (showSession && selectedExercise) {
    return (
      <ExerciseSession
        exercise={selectedExercise}
        onBack={() => {
          setShowSession(false);
          setSelectedExercise(null);
        }}
      />
    );
  }

  if (selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-background">
        <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedExercise(null)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{selectedExercise.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedExercise.description}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Exercise Header */}
            <Card className="mb-8 animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{selectedExercise.image}</div>
                  <div className="flex space-x-2">
                    <Badge className={getDifficultyColor(selectedExercise.difficulty)}>
                      {selectedExercise.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {selectedExercise.duration}
                    </Badge>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-2">{selectedExercise.title}</h2>
                <p className="text-muted-foreground">{selectedExercise.description}</p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mb-8 animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-energy" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedExercise.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-energy rounded-full" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="flex-1 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Exercise Button */}
            <div className="mt-8 text-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => setShowSession(true)}
              >
                <Timer className="w-5 h-5 mr-2" />
                Start Exercise Session
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Interactive session with guided steps and animations
              </p>
            </div>
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
              <h1 className="text-2xl font-bold">Stress Relief & Focus Exercises</h1>
              <p className="text-sm text-muted-foreground">
                Physical and mental exercises for better wellness and concentration
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? "bg-gradient-primary" : ""}
          >
            All Exercises
          </Button>
          <Button
            variant={selectedCategory === 'stress-relief' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('stress-relief')}
            className={`flex items-center gap-1 ${selectedCategory === 'stress-relief' ? "bg-gradient-energy" : ""}`}
          >
            <Smile className="w-4 h-4" />
            Stress Relief
          </Button>
          <Button
            variant={selectedCategory === 'concentration' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('concentration')}
            className={`flex items-center gap-1 ${selectedCategory === 'concentration' ? "bg-gradient-calm" : ""}`}
          >
            <Brain className="w-4 h-4" />
            Concentration
          </Button>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <Card 
              key={exercise.id}
              className="cursor-pointer hover:shadow-glow transition-all hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{exercise.image}</div>
                  <h3 className="font-semibold mb-2">{exercise.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {exercise.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-center space-x-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {exercise.duration}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-center">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getCategoryIcon(exercise.category)}
                      {exercise.category === 'both' ? 'Stress & Focus' : 
                       exercise.category === 'stress-relief' ? 'Stress Relief' : 'Concentration'}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90"
                    onClick={() => {
                      setSelectedExercise(exercise);
                      setShowSession(true);
                    }}
                  >
                    Start Exercise Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="mt-12 bg-gradient-energy/5 border-energy/20 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-energy" />
              Exercise Tips for Students
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-primary">Best Times to Exercise</h4>
                <p className="text-muted-foreground">
                  Morning: Concentration exercises before study sessions. 
                  Evening: Stress relief exercises after demanding days.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-wellness">Consistency Matters</h4>
                <p className="text-muted-foreground">
                  Regular 5-10 minute sessions are more effective than occasional long sessions. 
                  Build habits gradually.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-calm">Listen to Your Body</h4>
                <p className="text-muted-foreground">
                  Stop if you feel dizzy or uncomfortable. Adjust exercises to your comfort level and current abilities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ExercisePage;