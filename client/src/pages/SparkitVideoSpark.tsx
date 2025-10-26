import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import VideoCall from '@/components/VideoCall';
import { apiRequest } from '@/lib/queryClient';
import { ArrowLeft, Heart, Timer, MapPin, DollarSign, Flame, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  energyLevel: 'low' | 'medium' | 'high';
  location: 'indoor' | 'outdoor' | 'either' | 'video-call' | 'async' | 'text';
  cost: 'free' | 'low' | 'medium' | 'high';
  spiceLevel: number;
  tips: string[];
}

export default function SparkitVideoSpark() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

  useEffect(() => {
    const activityData = sessionStorage.getItem('currentVideoActivity');
    if (activityData) {
      setActivity(JSON.parse(activityData));
    } else {
      navigate('/spark');
    }
  }, [navigate]);

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const coupleId = localStorage.getItem('sparkitCoupleId');
      if (!coupleId) throw new Error('No couple ID found');
      
      return await apiRequest('POST', '/api/sparkit/video/create-room', { coupleId });
    },
    onSuccess: (data: any) => {
      setRoomUrl(data.roomUrl);
      setSessionId(data.sessionId);
      setIsLoadingRoom(false);
    },
    onError: (error: any) => {
      console.error('Error creating video room:', error);
      toast({
        title: 'Video call failed',
        description: error.message || 'Could not start video call. Please try again.',
        variant: 'destructive',
      });
      setIsLoadingRoom(false);
    },
  });

  const endSessionMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) return;
      await apiRequest('POST', '/api/sparkit/video/end-session', { sessionId });
    },
    onSuccess: () => {
      sessionStorage.removeItem('currentVideoActivity');
      navigate('/spark');
    },
  });

  const handleStartVideo = () => {
    setIsLoadingRoom(true);
    createRoomMutation.mutate();
  };

  const handleLeaveCall = () => {
    endSessionMutation.mutate();
  };

  if (!activity) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading activity...</p>
      </div>
    );
  }

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'text-green-500';
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="nexus-app min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-red-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              if (sessionId) {
                endSessionMutation.mutate();
              } else {
                navigate('/spark');
              }
            }}
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Spark
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="nexus-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="nexus-gradient-text text-2xl mb-2">
                    {activity.title}
                  </CardTitle>
                  <Badge variant="secondary" className="mb-3">
                    {activity.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-relaxed">{activity.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{activity.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className={`h-4 w-4 ${getEnergyColor(activity.energyLevel)}`} />
                  <span className="text-sm capitalize">{activity.energyLevel} Energy</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{activity.location.replace('-', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className={`h-4 w-4 ${getCostColor(activity.cost)}`} />
                  <span className="text-sm capitalize">{activity.cost}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Spice Level: {activity.spiceLevel}/5</span>
                <div className="flex gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Flame
                      key={i}
                      className={`h-3 w-3 ${
                        i < activity.spiceLevel ? 'text-orange-500 fill-orange-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {activity.tips.length > 0 && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Tips
                  </h3>
                  <ul className="space-y-2">
                    {activity.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="nexus-card">
            <CardHeader>
              <CardTitle>Video Call</CardTitle>
            </CardHeader>
            <CardContent>
              {!roomUrl ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">Ready to connect?</h3>
                    <p className="text-muted-foreground">
                      Start a video call with your partner to enjoy this activity together!
                    </p>
                  </div>
                  <Button
                    onClick={handleStartVideo}
                    disabled={isLoadingRoom}
                    className="nexus-gradient px-8 py-6 text-lg"
                    data-testid="button-start-video"
                  >
                    {isLoadingRoom ? 'Starting...' : 'Start Video Call'}
                  </Button>
                </div>
              ) : (
                <div className="h-96">
                  <VideoCall roomUrl={roomUrl} onLeave={handleLeaveCall} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
