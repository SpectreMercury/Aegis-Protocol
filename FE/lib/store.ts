import { create } from 'zustand';

interface SystemState {
  isEmergencyMode: boolean;
  setEmergencyMode: (status: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  isEmergencyMode: false,
  setEmergencyMode: (status) => set({ isEmergencyMode: status }),
})); 