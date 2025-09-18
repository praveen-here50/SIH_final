import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Music2
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  category: string;
}

interface MusicPageProps {
  onBack: () => void;
}

const MusicPage = ({ onBack }: MusicPageProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  // Curated relaxing tracks (using placeholder audio URLs)
  const tracks: Track[] = [
    {
      id: '1',
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      duration: 180,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Nature'
    },
    {
      id: '2', 
      title: 'Forest Rain',
      artist: 'Peaceful Mind',
      duration: 240,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Nature'
    },
    {
      id: '3',
      title: 'Meditation Bell',
      artist: 'Zen Garden',
      duration: 120,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Meditation'
    },
    {
      id: '4',
      title: 'Soft Piano',
      artist: 'Relaxing Music',
      duration: 200,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Instrumental'
    },
    {
      id: '5',
      title: 'Mountain Stream',
      artist: 'Nature Therapy',
      duration: 300,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Nature'
    },
    {
      id: '6',
      title: 'Ambient Space',
      artist: 'Cosmic Calm',
      duration: 280,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      category: 'Ambient'
    }
  ];

  const [playlist, setPlaylist] = useState(tracks);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const playTrack = (track: Track, index: number) => {
    setCurrentTrack(track);
    setCurrentIndex(index);
    setIsPlaying(true);
    
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    
    playTrack(playlist[nextIndex], nextIndex);
  };

  const handlePrevious = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    playTrack(playlist[prevIndex], prevIndex);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const categories = ['All', ...Array.from(new Set(tracks.map(t => t.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTracks = selectedCategory === 'All' 
    ? tracks 
    : tracks.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-background">
      <audio ref={audioRef} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Calming Playlist</h1>
              <p className="text-sm text-muted-foreground">
                Relaxing sounds for focus and stress relief
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Current Track Player */}
        {currentTrack && (
          <Card className="mb-8 shadow-glow animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                {/* Album Art */}
                <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Music2 className="w-10 h-10 text-white" />
                </div>
                
                {/* Track Info & Controls */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={isShuffle ? 'text-primary' : ''}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handlePrevious}>
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 rounded-full w-12 h-12 p-0"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handleNext}>
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={isRepeat ? 'text-primary' : ''}
                  >
                    <Repeat className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2 w-32">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-primary" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tracks List */}
        <div className="space-y-2">
          {filteredTracks.map((track, index) => (
            <Card 
              key={track.id} 
              className={`cursor-pointer hover:shadow-medium transition-all animate-slide-up ${
                currentTrack?.id === track.id ? 'border-primary shadow-glow' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => playTrack(track, tracks.indexOf(track))}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-calm rounded-lg flex items-center justify-center ${
                      currentTrack?.id === track.id && isPlaying ? 'animate-pulse' : ''
                    }`}>
                      {currentTrack?.id === track.id && isPlaying ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
                      ) : (
                        <Music2 className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{track.title}</h4>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(track.duration)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Card */}
        <Card className="mt-8 bg-gradient-calm/5 border-calm/20 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <Music2 className="w-5 h-5 mr-2 text-calm" />
              Music for Stress Relief
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div>
                <strong>Nature Sounds:</strong> Help reduce cortisol levels and promote relaxation
              </div>
              <div>
                <strong>Instrumental Music:</strong> Aids concentration without lyrical distractions
              </div>
              <div>
                <strong>Ambient Sounds:</strong> Create a peaceful environment for study or meditation
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MusicPage;