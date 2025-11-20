import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/use-socket';
import WebRTCManager from '@/lib/webrtc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Video, Mic, MicOff, VideoOff, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function VideoTutoring({ roomId, isHost }) {
  const socket = useSocket();
  const { toast } = useToast();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const webrtcRef = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!socket.connected) return;

    const initializeWebRTC = async () => {
      try {
        // Create WebRTC manager
        webrtcRef.current = new WebRTCManager(socket, roomId);
        await webrtcRef.current.initialize(isHost);

        // Start local stream
        const localStream = await webrtcRef.current.startLocalStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // Join room
        socket.emit('join_room', roomId);
        
        toast({
          title: 'Connected to room',
          description: isHost ? 'Waiting for student to join...' : 'Connected to tutor session'
        });
      } catch (error) {
        toast({
          title: 'Connection Error',
          description: 'Failed to access camera or microphone',
          variant: 'destructive'
        });
      }
    };

    initializeWebRTC();

    return () => {
      if (webrtcRef.current) {
        socket.emit('leave_room', roomId);
        webrtcRef.current.cleanup();
      }
    };
  }, [socket.connected, roomId, isHost]);

  // Update remote video when connection is established
  useEffect(() => {
    if (webrtcRef.current?.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = webrtcRef.current.remoteStream;
      setIsConnected(true);
    }
  }, [webrtcRef.current?.remoteStream]);

  const handleToggleAudio = () => {
    if (webrtcRef.current) {
      const newState = !isMuted;
      webrtcRef.current.toggleAudio(!newState);
      setIsMuted(newState);
    }
  };

  const handleToggleVideo = () => {
    if (webrtcRef.current) {
      const newState = !isVideoOff;
      webrtcRef.current.toggleVideo(!newState);
      setIsVideoOff(newState);
    }
  };

  const handleEndCall = () => {
    if (webrtcRef.current) {
      webrtcRef.current.cleanup();
      setIsConnected(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const message = {
      text: inputMessage,
      sender: 'me',
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', {
      roomId,
      message: message
    });

    setMessages(prev => [...prev, message]);
    setInputMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 relative">
        <div className="relative h-full rounded-lg overflow-hidden bg-background/95">
          {/* Remote Video (Full Size) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-4 right-4 w-48 rounded-lg overflow-hidden shadow-lg"
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full"
            />
          </motion.div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 p-4 rounded-full bg-background/90 shadow-lg">
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="icon"
              onClick={handleToggleAudio}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
            
            <Button
              variant={isVideoOff ? 'destructive' : 'secondary'}
              size="icon"
              onClick={handleToggleVideo}
            >
              {isVideoOff ? <VideoOff /> : <Video />}
            </Button>
            
            <Button
              variant="destructive"
              size="icon"
              onClick={handleEndCall}
            >
              <Phone className="rotate-225" />
            </Button>
            
            <Button
              variant={showChat ? 'default' : 'secondary'}
              size="icon"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="h-full max-w-sm ml-auto">
          <DialogHeader>
            <DialogTitle>Session Chat</DialogTitle>
            <DialogDescription>
              Communicate with your tutor/student
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.sender === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-md bg-background border"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default VideoTutoring;