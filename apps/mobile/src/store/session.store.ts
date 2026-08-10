import { useSyncExternalStore } from 'react';

import type { PatientProfile } from '@/modules/profile/types/profile.types';

interface SessionState {
  selectedProfile: PatientProfile | null;
}

interface SessionActions {
  setSelectedProfile: (profile: PatientProfile | null) => void;
}

type SessionStore = SessionState & SessionActions;

const listeners = new Set<() => void>();

let snapshot: SessionStore = {
  selectedProfile: null,
  setSelectedProfile,
};

function emitChange() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function setSelectedProfile(profile: PatientProfile | null) {
  snapshot = {
    ...snapshot,
    selectedProfile: profile,
  };

  emitChange();
}

export function useSessionStore<T>(
  selector: (state: SessionStore) => T,
) {
  return useSyncExternalStore(
    subscribe,
    () => selector(snapshot),
    () => selector(snapshot),
  );
}
