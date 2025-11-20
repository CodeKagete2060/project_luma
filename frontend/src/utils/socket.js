import { io } from 'socket.io-client';

const defaultUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

const socket = io(defaultUrl, {
  autoConnect: false,
});

export default socket;

