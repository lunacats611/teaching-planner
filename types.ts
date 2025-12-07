export enum SyllabusLevel {
  AS = 'AS Level',
  A = 'A Level',
  IGCSE = 'IGCSE',
  CUSTOM = 'Custom', // Added for user defined topics
}

export interface Topic {
  id: string;
  sectionId: number;
  title: string;
  level: SyllabusLevel;
  estimatedHours: number;
  description?: string;
}

export interface ClassSession {
  weekStart: string; // ISO Date string
  weekEnd: string;   // ISO Date string
  topics: Topic[];
  hoursUsed: number;
}

export type ClassLevel = 'AS' | 'A2' | 'Full' | 'IGCSE';

export interface Classroom {
  id: string;
  name: string;
  level: ClassLevel;
  startDate: string; // ISO Date string
  examDate: string;  // ISO Date string
  weeklyHours: number;
  completedTopicIds: string[]; // List of IDs
  topicOrder: string[]; // List of Topic IDs in priority order
  topicHoursOverrides: { [topicId: string]: number }; // Custom hours for specific topics
  customTopics: Topic[]; // New field for user-added practice sessions
}

export interface SyllabusSection {
  id: number;
  title: string;
  level: SyllabusLevel;
  topics: Topic[];
}