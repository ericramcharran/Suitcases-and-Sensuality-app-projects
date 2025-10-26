import { useEffect, useState } from 'react';
import { DailyProvider, useDaily, useParticipantIds, DailyVideo } from '@daily-co/daily-react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { Button } from '@/components/ui/button';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2 } from 'lucide-react';

interface VideoCallProps {
  roomUrl: string;
  onLeave: () => void;
}

function VideoCallContent({ roomUrl, onLeave }: VideoCallProps) {
  const callObject = useDaily();
  const participantIds = useParticipantIds();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    if (!callObject) return;

    callObject.join({ url: roomUrl });

    return () => {
      callObject.leave();
    };
  }, [callObject, roomUrl]);

  const toggleCamera = () => {
    if (callObject) {
      callObject.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (callObject) {
      callObject.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const handleLeave = () => {
    if (callObject) {
      callObject.leave();
    }
    onLeave();
  };

  const openInNewWindow = () => {
    window.open(roomUrl, '_blank', 'width=1280,height=720');
  };

  const remoteParticipants = participantIds.filter(id => id !== 'local');

  return (
    <div className="nexus-app relative w-full h-full bg-black rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 gap-2 p-2 h-full">
        {participantIds.map((id) => (
          <div key={id} className="relative w-full h-full rounded-lg overflow-hidden bg-gray-900">
            <DailyVideo
              automirror
              sessionId={id}
              type={id === 'local' ? 'video' : 'video'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-sm">
              {id === 'local' ? 'You' : 'Partner'}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/80 px-4 py-3 rounded-full">
        <Button
          size="icon"
          variant={isCameraOn ? 'default' : 'destructive'}
          onClick={toggleCamera}
          className="rounded-full"
          data-testid="button-toggle-camera"
        >
          {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>

        <Button
          size="icon"
          variant={isMicOn ? 'default' : 'destructive'}
          onClick={toggleMic}
          className="rounded-full"
          data-testid="button-toggle-mic"
        >
          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={openInNewWindow}
          className="rounded-full"
          data-testid="button-popout-video"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={handleLeave}
          className="rounded-full"
          data-testid="button-leave-call"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>

      {remoteParticipants.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-white text-lg font-medium">Waiting for your partner to join...</p>
        </div>
      )}
    </div>
  );
}

export default function VideoCall({ roomUrl, onLeave }: VideoCallProps) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  useEffect(() => {
    const daily = DailyIframe.createCallObject({
      subscribeToTracksAutomatically: true,
    });
    setCallObject(daily);

    return () => {
      daily.destroy();
    };
  }, []);

  if (!callObject) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading video...</p>
      </div>
    );
  }

  return (
    <DailyProvider callObject={callObject}>
      <VideoCallContent roomUrl={roomUrl} onLeave={onLeave} />
    </DailyProvider>
  );
}
