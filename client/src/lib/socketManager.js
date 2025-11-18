import { io } from 'socket.io-client';
import { create } from 'zustand';

const SOCKET_URL = '/'; // Uses same domain as API
const RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_DELAY = 1000;

class SocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connectionAttempts = 0;
  }

  connect(token) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      reconnectionAttempts: RECONNECTION_ATTEMPTS,
      reconnectionDelay: RECONNECTION_DELAY,
      autoConnect: true
    });

    this.setupListeners();
  }

  setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connectionAttempts = 0;
      useSocketStore.getState().setConnected(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      useSocketStore.getState().setConnected(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connectionAttempts++;

      if (this.connectionAttempts >= RECONNECTION_ATTEMPTS) {
        useSocketStore.getState().setError('Failed to connect to server');
      }
    });

    // Handle notifications
    this.socket.on('notification', (data) => {
      useSocketStore.getState().addNotification(data);
    });

    // Handle presence updates
    this.socket.on('presence', (data) => {
      useSocketStore.getState().updatePresence(data);
    });

    // Handle chat messages
    this.socket.on('chat_message', (data) => {
      useSocketStore.getState().addMessage(data);
    });
  }

  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit event:', event);
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) return;
    
    // Store the callback in our listeners map
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    // Add the listener to socket
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    // Remove from our listeners map
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
    
    // Remove from socket
    this.socket.off(event, callback);
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null;
    this.listeners.clear();
    useSocketStore.getState().reset();
  }
}

// Create a singleton instance
export const socketManager = new SocketManager();

// Create a Zustand store for socket state
export const useSocketStore = create((set) => ({
  connected: false,
  error: null,
  notifications: [],
  presence: {},
  messages: [],

  setConnected: (connected) => set({ connected, error: null }),
  setError: (error) => set({ error }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  
  updatePresence: (presence) => set((state) => ({
    presence: { ...state.presence, ...presence }
  })),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  reset: () => set({
    connected: false,
    error: null,
    notifications: [],
    presence: {},
    messages: []
  })
}));