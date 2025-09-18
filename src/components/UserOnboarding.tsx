import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Users, Briefcase, GraduationCap } from 'lucide-react';
import aiMascot from '@/assets/ai-mascot.png';

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

interface UserOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

const UserOnboarding = ({ onComplete }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: '',
    stressLevel: '',
    goals: [],
    personalInfo: {
      name: '',
      age: '',
      occupation: '',
      stressFactors: ''
    }
  });

  const steps = [
    { title: "Welcome to MINDEASE", subtitle: "Let's get to know you better" },
    { title: "What describes you best?", subtitle: "This helps us personalize your experience" },
    { title: "How's your stress level?", subtitle: "Be honest - we're here to help" },
    { title: "What are your goals?", subtitle: "Select all that apply to you" },
    { title: "Tell us more about yourself", subtitle: "Just a few more details" }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(onboardingData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const toggleGoal = (goal: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return onboardingData.userType !== '';
      case 2: return onboardingData.stressLevel !== '';
      case 3: return onboardingData.goals.length > 0;
      case 4: return onboardingData.personalInfo.name && onboardingData.personalInfo.age;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6 animate-fade-in">
            <img src={aiMascot} alt="AI Mascot" className="w-32 h-32 mx-auto animate-wave" />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome to MINDEASE! 🧘‍♀️
              </h2>
              <p className="text-muted-foreground text-lg">
                Your personal companion for stress relief and mental wellness. 
                Let's create a personalized experience just for you.
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                  onboardingData.userType === 'student' 
                    ? 'border-primary bg-primary/10 shadow-glow' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => updateData('userType', 'student')}
              >
                <div className="text-center space-y-3">
                  <GraduationCap className="w-12 h-12 mx-auto text-primary" />
                  <h3 className="font-semibold">Student</h3>
                  <p className="text-sm text-muted-foreground">
                    Academic stress, exams, assignments
                  </p>
                </div>
              </div>

              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                  onboardingData.userType === 'employee' 
                    ? 'border-wellness bg-wellness/10 shadow-glow' 
                    : 'border-border hover:border-wellness/50'
                }`}
                onClick={() => updateData('userType', 'employee')}
              >
                <div className="text-center space-y-3">
                  <Briefcase className="w-12 h-12 mx-auto text-wellness" />
                  <h3 className="font-semibold">Employee</h3>
                  <p className="text-sm text-muted-foreground">
                    Work pressure, deadlines, office stress
                  </p>
                </div>
              </div>

              <div 
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                  onboardingData.userType === 'others' 
                    ? 'border-calm bg-calm/10 shadow-glow' 
                    : 'border-border hover:border-calm/50'
                }`}
                onClick={() => updateData('userType', 'others')}
              >
                <div className="text-center space-y-3">
                  <Users className="w-12 h-12 mx-auto text-calm" />
                  <h3 className="font-semibold">Others</h3>
                  <p className="text-sm text-muted-foreground">
                    General wellness, life balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-slide-up">
            <RadioGroup 
              value={onboardingData.stressLevel} 
              onValueChange={(value) => updateData('stressLevel', value)}
              className="space-y-4"
            >
              {[
                { value: 'low', label: 'Low Stress', desc: 'Generally calm and relaxed' },
                { value: 'moderate', label: 'Moderate Stress', desc: 'Some pressure but manageable' },
                { value: 'high', label: 'High Stress', desc: 'Often overwhelmed and anxious' },
                { value: 'severe', label: 'Severe Stress', desc: 'Constant pressure, need immediate help' }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-card-hover transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Reduce daily stress',
                'Improve sleep quality',
                'Better focus & concentration',
                'Manage anxiety',
                'Build healthy habits',
                'Emotional balance',
                'Academic performance',
                'Work-life balance'
              ].map((goal) => (
                <div
                  key={goal}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                    onboardingData.goals.includes(goal)
                      ? 'border-energy bg-energy/10 shadow-glow'
                      : 'border-border hover:border-energy/50'
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <div className="text-center">
                    <span className="font-medium">{goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={onboardingData.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={onboardingData.personalInfo.age}
                  onChange={(e) => updatePersonalInfo('age', e.target.value)}
                  placeholder="Your age"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation/Field of Study</Label>
              <Input
                id="occupation"
                value={onboardingData.personalInfo.occupation}
                onChange={(e) => updatePersonalInfo('occupation', e.target.value)}
                placeholder="e.g., Computer Science Student, Marketing Manager"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stressFactors">What are your main stress factors? (Optional)</Label>
              <Textarea
                id="stressFactors"
                value={onboardingData.personalInfo.stressFactors}
                onChange={(e) => updatePersonalInfo('stressFactors', e.target.value)}
                placeholder="Tell us what causes you stress... exams, deadlines, relationships, etc."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-strong">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <p className="text-muted-foreground">{steps[currentStep].subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;