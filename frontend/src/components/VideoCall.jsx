import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import api from '../utils/axiosConfig';

const VideoCall = ({ sessionId, userId, userRole, onEndCall }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

    socketRef.current.on('webrtc:offer', handleOffer);
    socketRef.current.on('webrtc:answer', handleAnswer);
    socketRef.current.on('webrtc:ice-candidate', handleIceCandidate);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Initialize local media
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setConnectionStatus('media-error');
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize peer connection when local stream is ready
  useEffect(() => {
    if (localStream && socketRef.current) {
      initPeerConnection();
    }
  }, [localStream, socketRef.current]);

  const initPeerConnection = useCallback(async () => {
    try {
      const isInitiator = userRole === 'parent'; // Parent initiates the connection

      const peerInstance = new Peer({
        initiator: isInitiator,
        trickle: false,
        stream: localStream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add TURN servers in production
          ]
        }
      });

      peerInstance.on('signal', async (data) => {
        try {
          if (data.type === 'offer') {
            await api.post(`/live-sessions/${sessionId}/signal/offer`, { offer: data });
          } else if (data.type === 'answer') {
            await api.post(`/live-sessions/${sessionId}/signal/answer`, { answer: data });
          }
        } catch (error) {
          console.error('Error sending signal:', error);
        }
      });

      peerInstance.on('connect', () => {
        console.log('Peer connected');
        setIsConnected(true);
        setConnectionStatus('connected');
      });

      peerInstance.on('stream', (stream) => {
        console.log('Received remote stream');
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      });

      peerInstance.on('error', (error) => {
        console.error('Peer error:', error);
        setConnectionStatus('error');
      });

      peerInstance.on('close', () => {
        console.log('Peer connection closed');
        setIsConnected(false);
        setConnectionStatus('disconnected');
      });

      setPeer(peerInstance);
    } catch (error) {
      console.error('Error initializing peer connection:', error);
      setConnectionStatus('error');
    }
  }, [sessionId, userId, userRole, localStream]);

  const handleOffer = useCallback((data) => {
    if (peer && !peer.destroyed) {
      peer.signal(data.offer);
    }
  }, [peer]);

  const handleAnswer = useCallback((data) => {
    if (peer && !peer.destroyed) {
      peer.signal(data.answer);
    }
  }, [peer]);

  const handleIceCandidate = useCallback((data) => {
    // Since we're using trickle: false, we don't need to handle ICE candidates
    // But this is here for future expansion
  }, []);

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };

  const endCall = async () => {
    try {
      await api.put(`/live-sessions/${sessionId}/end`);
    } catch (error) {
      console.error('Error ending call:', error);
    }

    // Clean up
    if (peer && !peer.destroyed) {
      peer.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    if (onEndCall) {
      onEndCall();
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting': return 'bg-yellow-500';
      case 'connected': return 'bg-green-500';
      case 'error':
      case 'media-error': return 'bg-red-500';
      case 'disconnected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'error': return 'Connection Error';
      case 'media-error': return 'Camera/Microphone Error';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Connection Status */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-white text-sm font-medium">{getStatusText()}</span>
      </div>

      {/* Remote Video (Main) */}
      <div className="relative w-full h-96 bg-gray-900">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📹</div>
              <p className="text-lg">Waiting for other participant...</p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-xs">No camera</div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
        <button
          onClick={toggleMute}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>

        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isVideoOff ? '📷' : '📹'}
        </button>

        <button
          onClick={endCall}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
        >
          📞
        </button>
      </div>

      {/* Error Messages */}
      {connectionStatus === 'media-error' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold mb-2">Camera/Microphone Access Required</h3>
            <p className="mb-4">Please allow access to your camera and microphone to join the video call.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
          Connection failed. Please check your internet connection.
        </div>
      )}
    </div>
  );
};

export default VideoCall;