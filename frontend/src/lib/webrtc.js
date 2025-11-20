// WebRTC peer connection configuration
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
  iceCandidatePoolSize: 10
};

class WebRTCManager {
  constructor(socket, roomId) {
    this.socket = socket;
    this.roomId = roomId;
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isInitiator = false;
    this.isConnected = false;
    
    // Bind methods
    this.handleIceCandidate = this.handleIceCandidate.bind(this);
    this.handleTrack = this.handleTrack.bind(this);
    this.handleNegotiationNeeded = this.handleNegotiationNeeded.bind(this);
  }

  async initialize(isInitiator = false) {
    this.isInitiator = isInitiator;
    this.peerConnection = new RTCPeerConnection(configuration);
    
    // Set up event handlers
    this.peerConnection.onicecandidate = this.handleIceCandidate;
    this.peerConnection.ontrack = this.handleTrack;
    this.peerConnection.onnegotiationneeded = this.handleNegotiationNeeded;

    // Set up socket listeners
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    // Handle incoming signals
    this.socket.on('signal', async ({ signal, senderId }) => {
      try {
        if (signal.type === 'offer') {
          await this.handleOffer(signal);
        } else if (signal.type === 'answer') {
          await this.handleAnswer(signal);
        } else if (signal.candidate) {
          await this.handleNewICECandidate(signal);
        }
      } catch (error) {
        console.error('Error handling signal:', error);
      }
    });
  }

  async startLocalStream(constraints = { video: true, audio: true }) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  async handleOffer(offer) {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      this.socket.emit('signal', {
        roomId: this.roomId,
        signal: answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  async handleAnswer(answer) {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  async handleNewICECandidate(candidate) {
    if (!this.peerConnection) return;
    
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  handleIceCandidate(event) {
    if (event.candidate) {
      this.socket.emit('signal', {
        roomId: this.roomId,
        signal: event.candidate
      });
    }
  }

  handleTrack(event) {
    this.remoteStream = event.streams[0];
    this.isConnected = true;
  }

  async handleNegotiationNeeded() {
    if (!this.isInitiator) return;
    
    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.socket.emit('signal', {
        roomId: this.roomId,
        signal: offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  // Media control methods
  async toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  // Cleanup
  cleanup() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.isConnected = false;
  }
}

export default WebRTCManager;