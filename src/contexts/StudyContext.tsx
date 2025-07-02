
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface StudyUnit {
  id: string; // Changed from number to string (UUID)
  name: string;
  color: string;
  totalHours: number;
  weeklyGoal: number;
  lastStudied?: Date;
}

export interface StudySession {
  id: string;
  courseId: string; // Changed from unitId to courseId
  date: Date;
  duration: number; // in minutes
  notes?: string;
  subtopic?: string;
  confidence_rating?: number;
}

export interface StudyContextType {
  units: StudyUnit[];
  sessions: StudySession[];
  currentWeek: number;
  loading: boolean;
  addStudySession: (courseId: string, duration: number, notes?: string, subtopic?: string, confidenceRating?: number) => Promise<void>;
  getUnitProgress: (courseId: string) => number;
  getWeeklyProgress: () => Record<string, number>;
  getLaggingUnits: () => StudyUnit[];
  getStudySuggestions: () => string[];
  refreshData: () => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [units, setUnits] = useState<StudyUnit[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Reset data when user is not authenticated
      setUnits([]);
      setSessions([]);
    }
  }, [user]);

  // Set up real-time subscription for course changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('course-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses', filter: `user_id=eq.${user.id}` },
        () => {
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch courses (which are now our study units)
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (coursesError) throw coursesError;

      // Fetch study sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Process courses data as study units
      const processedUnits = coursesData.map(course => ({
        id: course.id,
        name: course.name,
        color: course.color || '#3B82F6',
        weeklyGoal: course.weekly_goal || 8,
        totalHours: sessionsData
          .filter(session => session.course_id === course.id)
          .reduce((total, session) => total + session.duration, 0) / 60,
        lastStudied: sessionsData
          .filter(session => session.course_id === course.id)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date
          ? new Date(sessionsData.filter(session => session.course_id === course.id)[0].date)
          : undefined
      }));

      // Process sessions data
      const processedSessions = sessionsData.map(session => ({
        id: session.id,
        courseId: session.course_id,
        date: new Date(session.date),
        duration: session.duration,
        notes: session.notes,
        subtopic: session.subtopic,
        confidence_rating: session.confidence_rating
      }));

      setUnits(processedUnits);
      setSessions(processedSessions);

      // Calculate current week (simplified - could be enhanced)
      const startOfSemester = new Date('2024-01-15'); // Example start date
      const now = new Date();
      const weeksPassed = Math.floor((now.getTime() - startOfSemester.getTime()) / (7 * 24 * 60 * 60 * 1000));
      setCurrentWeek(Math.max(1, Math.min(weeksPassed + 1, 12)));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load study data');
    } finally {
      setLoading(false);
    }
  };

  const addStudySession = async (courseId: string, duration: number, notes?: string, subtopic?: string, confidenceRating?: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          duration,
          notes,
          subtopic,
          confidence_rating: confidenceRating,
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newSession: StudySession = {
        id: data.id,
        courseId: data.course_id,
        date: new Date(data.date),
        duration: data.duration,
        notes: data.notes,
        subtopic: data.subtopic,
        confidence_rating: data.confidence_rating
      };

      setSessions(prev => [newSession, ...prev]);

      // Update unit total hours
      setUnits(prev => prev.map(unit => 
        unit.id === courseId 
          ? { ...unit, totalHours: unit.totalHours + (duration / 60), lastStudied: new Date() }
          : unit
      ));

      const unitName = units.find(u => u.id === courseId)?.name;
      toast.success(`Logged ${duration} minutes for ${unitName}`);

    } catch (error) {
      console.error('Error adding study session:', error);
      toast.error('Failed to log study session');
    }
  };

  const getUnitProgress = (courseId: string): number => {
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    
    const weeklyMinutes = sessions
      .filter(session => 
        session.courseId === courseId && 
        session.date >= thisWeekStart
      )
      .reduce((total, session) => total + session.duration, 0);
    
    const unit = units.find(u => u.id === courseId);
    if (!unit) return 0;
    
    return Math.min((weeklyMinutes / 60) / unit.weeklyGoal, 1) * 100;
  };

  const getWeeklyProgress = (): Record<string, number> => {
    const progress: Record<string, number> = {};
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
    
    if (currentWeek === 5) {
      suggestions.push("🚨 CAT Week 5 approaching! Focus on reviewing all units.");
    } else if (currentWeek === 8) {
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
      loading,
      addStudySession,
      getUnitProgress,
      getWeeklyProgress,
      getLaggingUnits,
      getStudySuggestions,
      refreshData
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
