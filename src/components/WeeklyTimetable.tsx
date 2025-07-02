
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/contexts/StudyContext';
import { Calendar, Clock } from 'lucide-react';

const WeeklyTimetable = () => {
  const { units, getLaggingUnits, getUnitProgress } = useStudy();
  const laggingUnits = getLaggingUnits();
  
  // Filter out units that are 100% complete
  const activeUnits = units.filter(unit => getUnitProgress(unit.id) < 100);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Suggested timetable based on available hours and unit priorities
  const getTimetableForDay = (dayIndex: number) => {
    const sessions = [];
    
    // Filter lagging units to only include active ones
    const activeLaggingUnits = laggingUnits.filter(unit => getUnitProgress(unit.id) < 100);
    
    if (dayIndex < 5) { // Weekdays
      // Morning session 3am-7am (4 hours)
      if (activeLaggingUnits.length > 0) {
        sessions.push({
          time: '03:00 - 05:00',
          units: activeLaggingUnits.slice(0, 2),
          type: 'priority'
        });
      }
      if (activeUnits.length > 2) {
        sessions.push({
          time: '05:00 - 07:00',
          units: activeUnits.slice(2, 4),
          type: 'regular'
        });
      }
      
      // Evening session 5pm-8pm (3 hours)
      if (activeUnits.length > 0) {
        sessions.push({
          time: '17:00 - 18:30',
          units: [activeUnits[dayIndex % activeUnits.length]],
          type: 'regular'
        });
        sessions.push({
          time: '18:30 - 20:00',
          units: [activeUnits[(dayIndex + 1) % activeUnits.length]],
          type: 'regular'
        });
      }
    } else if (dayIndex === 5) { // Saturday
      if (activeLaggingUnits.length > 0) {
        sessions.push({
          time: '06:00 - 08:30',
          units: activeLaggingUnits.slice(0, 2),
          type: 'priority'
        });
      }
      if (activeUnits.length > 4) {
        sessions.push({
          time: '08:30 - 11:00',
          units: activeUnits.slice(4, 6),
          type: 'regular'
        });
      }
      if (activeUnits.length > 6) {
        sessions.push({
          time: '14:00 - 15:30',
          units: [activeUnits[6]],
          type: 'regular'
        });
      }
      if (activeUnits.length > 7) {
        sessions.push({
          time: '15:30 - 17:00',
          units: [activeUnits[7]],
          type: 'regular'
        });
      }
    } else { // Sunday
      if (activeLaggingUnits.length > 0) {
        sessions.push({
          time: '06:00 - 08:30',
          units: activeLaggingUnits.slice(0, 2),
          type: 'priority'
        });
      }
      if (activeUnits.length > 0) {
        sessions.push({
          time: '08:30 - 11:00',
          units: activeUnits.slice(0, 2),
          type: 'review'
        });
      }
    }
    
    return sessions;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5" />
          Weekly Study Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {days.map((day, index) => {
            const sessions = getTimetableForDay(index);
            
            return (
              <div key={day} className="border border-border rounded-lg p-4 bg-card">
                <h3 className="font-semibold mb-3 text-center text-foreground">{day}</h3>
                <div className="space-y-2">
                  {sessions.map((session, sessionIndex) => (
                    <div 
                      key={sessionIndex} 
                      className={`p-2 rounded text-xs border-l-4 ${
                        session.type === 'priority' 
                          ? 'bg-destructive/10 border-l-destructive dark:bg-destructive/20' 
                          : session.type === 'review'
                          ? 'bg-primary/10 border-l-primary dark:bg-primary/20'
                          : 'bg-accent border-l-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium text-foreground">{session.time}</span>
                      </div>
                      <div className="space-y-1">
                        {session.units.map(unit => (
                          <div key={unit.id} className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: unit.color }}
                            />
                            <span className="text-xs text-foreground">{unit.name}</span>
                          </div>
                        ))}
                      </div>
                      {session.type === 'priority' && (
                        <div className="text-xs text-destructive mt-1 font-medium">Priority Focus</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-border">
          <h4 className="font-medium mb-2 text-foreground">Timetable Legend:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive/10 border-l-2 border-destructive dark:bg-destructive/20"></div>
              <span className="text-foreground">Priority (Lagging Units)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent border-l-2 border-muted-foreground"></div>
              <span className="text-foreground">Regular Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/10 border-l-2 border-primary dark:bg-primary/20"></div>
              <span className="text-foreground">Review Sessions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyTimetable;
