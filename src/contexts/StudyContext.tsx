
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StudyUnit {
  id: number;
  name: string;
  color: string;
  totalHours: number;
  weeklyGoal: number;
  lastStudied?: Date;
}

export interface StudySession {
  id: string;
  unitId: number;
  date: Date;
  duration: number; // in minutes
  notes?: string;
}

export interface StudyContextType {
  units: StudyUnit[];
  sessions: StudySession[];
  currentWeek: number;
  addStudySession: (unitId: number, duration: number, notes?: string) => void;
  getUnitProgress: (unitId: number) => number;
  getWeeklyProgress: () => Record<number, number>;
  getLaggingUnits: () => StudyUnit[];
  getStudySuggestions: () => string[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const UNITS: StudyUnit[] = [
  { id: 1, name: 'Digital Logic and Design', color: '#3B82F6', totalHours: 0, weeklyGoal: 8 },
  { id: 2, name: 'System Analysis and Design', color: '#8B5CF6', totalHours: 0, weeklyGoal: 8 },
  { id: 3, name: 'Database Systems and Design', color: '#10B981', totalHours: 0, weeklyGoal: 8 },
  { id: 4, name: 'General Skills and Communications', color: '#F59E0B', totalHours: 0, weeklyGoal: 6 },
  { id: 5, name: 'Probability and Statistics', color: '#EF4444', totalHours: 0, weeklyGoal: 8 },
  { id: 6, name: 'Algorithm Design and Analysis', color: '#06B6D4', totalHours: 0, weeklyGoal: 8 },
  { id: 7, name: 'Programming Languages', color: '#84CC16', totalHours: 0, weeklyGoal: 8 },
  { id: 8, name: 'Operating Systems', color: '#F97316', totalHours: 0, weeklyGoal: 8 }
];

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<StudyUnit[]>(UNITS);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('studySessions');
    const savedWeek = localStorage.getItem('currentWeek');
    
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
      setSessions(parsedSessions);
    }
    
    if (savedWeek) {
      setCurrentWeek(parseInt(savedWeek));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('studySessions', JSON.stringify(sessions));
    
    // Update unit total hours
    const updatedUnits = units.map(unit => ({
      ...unit,
      totalHours: sessions
        .filter(session => session.unitId === unit.id)
        .reduce((total, session) => total + session.duration, 0) / 60
    }));
    setUnits(updatedUnits);
  }, [sessions]);

  const addStudySession = (unitId: number, duration: number, notes?: string) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      unitId,
      date: new Date(),
      duration,
      notes
    };
    
    setSessions(prev => [...prev, newSession]);
    console.log(`Added study session: ${duration} minutes for unit ${unitId}`);
  };

  const getUnitProgress = (unitId: number): number => {
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    
    const weeklyMinutes = sessions
      .filter(session => 
        session.unitId === unitId && 
        session.date >= thisWeekStart
      )
      .reduce((total, session) => total + session.duration, 0);
    
    const unit = units.find(u => u.id === unitId);
    if (!unit) return 0;
    
    return Math.min((weeklyMinutes / 60) / unit.weeklyGoal, 1) * 100;
  };

  const getWeeklyProgress = (): Record<number, number> => {
    const progress: Record<number, number> = {};
    units.forEach(unit => {
      progress[unit.id] = getUnitProgress(unit.id);
    });
    return progress;
  };

  const getLaggingUnits = (): StudyUnit[] => {
    const progress = getWeeklyProgress();
    return units.filter(unit => progress[unit.id] < 50).sort((a, b) => progress[a.id] - progress[b.id]);
  };

  const getStudySuggestions = (): string[] => {
    const laggingUnits = getLaggingUnits();
    const suggestions: string[] = [];
    
    if (currentWeek === 4) {
      suggestions.push("🚨 CAT Week 5 approaching! Focus on reviewing all units.");
    } else if (currentWeek === 7) {
      suggestions.push("🚨 CAT Week 8 approaching! Prioritize weaker units.");
    } else if (currentWeek >= 10) {
      suggestions.push("📚 Exam preparation mode! Create comprehensive review schedules.");
    }
    
    if (laggingUnits.length > 0) {
      suggestions.push(`⚠️ Units needing attention: ${laggingUnits.slice(0, 2).map(u => u.name).join(', ')}`);
    }
    
    if (laggingUnits.length === 0) {
      suggestions.push("✅ Great progress! Consider reviewing previous topics for retention.");
    }
    
    return suggestions;
  };

  return (
    <StudyContext.Provider value={{
      units,
      sessions,
      currentWeek,
      addStudySession,
      getUnitProgress,
      getWeeklyProgress,
      getLaggingUnits,
      getStudySuggestions
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
