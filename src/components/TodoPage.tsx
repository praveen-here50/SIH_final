import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar,
  Clock,
  Star,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: Date;
}

interface TodoPageProps {
  onBack: () => void;
}

const TodoPage = ({ onBack }: TodoPageProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const addTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title!");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      completed: false,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date()
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
    toast.success("Task added successfully! 🎉");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updated = { ...task, completed: !task.completed };
        if (updated.completed) {
          // Show celebration for completed task
          toast.success("🎉 Congratulations! Task completed! You're doing amazing!", {
            duration: 3000,
          });
        }
        return updated;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted!");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">To-Do List</h1>
                <p className="text-sm text-muted-foreground">
                  Organize your tasks to reduce stress
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">{totalTasks}</div>
              <div className="text-muted-foreground">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">{completedTasks}</div>
              <div className="text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-energy mb-2">
                {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
              </div>
              <div className="text-muted-foreground">Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <Card className="mb-8 animate-scale-in">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Task title *"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <Input
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <select 
                    className="w-full p-2 border rounded-lg bg-background"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <Button onClick={addTask} className="bg-gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="animate-fade-in">
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No tasks yet!</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first task to start organizing and reducing stress.
                </p>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task, index) => (
              <Card 
                key={task.id} 
                className={`animate-slide-up hover:shadow-medium transition-all ${
                  task.completed ? 'opacity-70' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Checkbox 
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {task.dueDate && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Created: {task.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Motivation Section */}
        {completedTasks > 0 && (
          <Card className="mt-8 bg-gradient-primary/5 border-primary/20 animate-fade-in">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto text-primary mb-2" />
              <h3 className="font-semibold mb-2">Great Progress! 🎉</h3>
              <p className="text-muted-foreground">
                You've completed {completedTasks} task{completedTasks !== 1 ? 's' : ''}! 
                Every completed task reduces stress and brings you closer to your goals.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default TodoPage;