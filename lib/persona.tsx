'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type PersonaId = 'leader' | 'manager' | 'rep';

export type Persona = {
  id: PersonaId;
  name: string;
  title: string;
  email: string;
  home: string;
  summary: string;
};

export const personas: Record<PersonaId, Persona> = {
  leader: {
    id: 'leader',
    name: 'Daniel Okonkwo',
    title: 'Revenue leader',
    email: 'daniel@piloteer.ai',
    home: '/dashboard/cro',
    summary: 'Teach Hunter, invite the team, and read company performance.',
  },
  manager: {
    id: 'manager',
    name: 'Priya Shah',
    title: 'Sales manager',
    email: 'priya@piloteer.ai',
    home: '/dashboard/manager',
    summary: 'Team performance. The company model stays with the revenue leader.',
  },
  rep: {
    id: 'rep',
    name: 'Emma Dixon',
    title: 'Sales rep',
    email: 'emma@piloteer.ai',
    home: '/dashboard',
    summary: 'Your book, Hunter Console, and calendar sync in Settings.',
  },
};

export const personaOrder: PersonaId[] = ['leader', 'manager', 'rep'];

const STORAGE_KEY = 'hunter-persona';

type PersonaContextValue = {
  persona: Persona | null;
  ready: boolean;
  setPersona: (id: PersonaId) => void;
};

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'leader' || stored === 'manager' || stored === 'rep') {
      setPersonaState(personas[stored]);
    }
    setReady(true);
  }, []);

  const setPersona = useCallback((id: PersonaId) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setPersonaState(personas[id]);
  }, []);

  return (
    <PersonaContext.Provider value={{ persona, ready, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const value = useContext(PersonaContext);
  if (!value) {
    throw new Error('usePersona must be used within PersonaProvider');
  }
  return value;
}

export function allows(id: PersonaId, pathname: string) {
  if (pathname === '/' || pathname.startsWith('/console')) return true;

  if (id === 'rep') {
    if (pathname.startsWith('/settings/teach')) return false;
    if (pathname.startsWith('/dashboard/manager') || pathname.startsWith('/dashboard/cro')) return false;
    return pathname === '/dashboard' || pathname.startsWith('/dashboard/deals') || pathname.startsWith('/settings');
  }

  if (id === 'manager') {
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard/cro') || pathname.startsWith('/settings/teach')) {
      return false;
    }
    return pathname.startsWith('/dashboard/') || pathname.startsWith('/settings');
  }

  if (
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/deals') ||
    pathname.startsWith('/dashboard/manager')
  ) {
    return false;
  }
  return pathname.startsWith('/dashboard/cro') || pathname.startsWith('/settings');
}
