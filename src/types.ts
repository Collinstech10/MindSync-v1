export interface ThoughtBattle {
  id: string;
  anxiousThought: string;
  initialAnxiety: number;
  evidenceFor: string[];
  evidenceAgainst: string[];
  counterThought: string;
  newAnxiety: number;
  timestamp: string; // ISO date
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  category: string;
  level?: number;
  difficulty: number; // 1 to 5
  status: 'Not Started' | 'Planned' | 'Tried It' | 'Completed' | 'Skipped for Now' | 'Repeat This Step' | 'locked' | 'active' | 'completed';
  fearBefore: number;
  fearAfter?: number;
  prediction?: string;
  plannedDate?: string;
  actuallyHappened?: string;
  learned?: string;
  nextMove?: string;
  completedAt?: string;
}

export interface MoodCheckIn {
  id: string;
  mood: string; // e.g. Serene, Anxious, Restless, Grounded, Exhausted
  energy: number; // 1 to 10
  anxiety: number; // 1 to 10
  physical: string[]; // e.g. 'Heart racing', 'Tight chest'
  notes?: string;
  timestamp: string;
}

export interface AppSettings {
  darkMode: boolean;
  gentleAnimations: boolean;
  dailyReminder: string;
  localPinLock: boolean;
}

export interface SessionLog {
  id: string;
  type: 'breathing' | 'grounding' | 'relaxation' | 'panic';
  name: string;
  durationSeconds: number;
  timestamp: string;
}
