import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true,
    });
  }
  return socket;
};

export const fetchAllDataFromMongo = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/data/all`);
    if (!res.ok) throw new Error('Failed to fetch data');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('MongoDB Atlas fetch notice:', error);
    return null;
  }
};

export const seedMongoAtlasDatabase = async (seedData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seedData),
    });
    return await res.json();
  } catch (error) {
    console.warn('MongoDB Atlas seed notice:', error);
    return null;
  }
};

export const syncToMongoAtlas = async (entity: string, data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/data/${entity}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.warn(`MongoDB Atlas sync notice for ${entity}:`, error);
    return null;
  }
};

export const removeFromMongoAtlas = async (entity: string, id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/data/${entity}/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.warn(`MongoDB Atlas delete notice for ${entity}:`, error);
    return null;
  }
};

export const subscribeToRealTimeUpdates = (onUpdate: (payload: { entity: string; action: string; data?: any; id?: string }) => void) => {
  const skt = getSocket();
  const handleUpdate = (payload: any) => {
    if (payload) {
      onUpdate(payload);
    }
  };
  skt.on('data_updated', handleUpdate);

  return () => {
    skt.off('data_updated', handleUpdate);
  };
};
