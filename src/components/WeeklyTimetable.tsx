
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudy } from '@/contexts/StudyContext';
import { Calendar, Clock } from 'lucide-react';

const WeeklyTimetable = () => {
  const { units, getLaggingUnits } = useStudy();
  const laggingUnits = getLaggingUnits();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Suggested timetable based on available hours and unit priorities
  const getTimetableForDay = (dayIndex: number) => {
    const sessions = [];
    
    if (dayIndex < 5) { // Weekdays
      // Morning session 3am-7am (4 hours)
      sessions.push({
        time: '03:00 - 05:00',
        units: laggingUnits.slice(0, 2),
        type: 'priority'
      });
      sessions.push({
        time: '05:00 - 07:00',
        units: units.slice(2, 4),
        type: 'regular'
      });
      
      // Evening session 5pm-8pm (3 hours)
      sessions.push({
        time: '17:00 - 18:30',
        units: [units[dayIndex % units.length]],
        type: 'regular'
      });
      sessions.push({
        time: '18:30 - 20:00',
        units: [units[(dayIndex + 1) % units.length]],
        type: 'regular'
      });
    } else if (dayIndex === 5) { // Saturday
      sessions.push({
        time: '06:00 - 08:30',
        units: laggingUnits.slice(0, 2),
        type: 'priority'
      });
      sessions.push({
        time: '08:30 - 11:00',
        units: units.slice(4, 6),
        type: 'regular'
      });
      sessions.push({
        time: '14:00 - 15:30',
        units: [units[6]],
        type: 'regular'
      });
      sessions.push({
        time: '15:30 - 17:00',
        units: [units[7]],
        type: 'regular'
      });
    } else { // Sunday
      sessions.push({
        time: '06:00 - 08:30',
        units: laggingUnits.slice(0, 2),
        type: 'priority'
      });
      sessions.push({
        time: '08:30 - 11:00',
        units: units.slice(0, 2),
        type: 'review'
      });
    }
    
    return sessions;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Study Timetable
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {days.map((day, index) => {
            const sessions = getTimetableForDay(index);
            
            return (
              <div key={day} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-center">{day}</h3>
                <div className="space-y-2">
                  {sessions.map((session, sessionIndex) => (
                    <div 
                      key={sessionIndex} 
                      className={`p-2 rounded text-xs ${
                        session.type === 'priority' 
                          ? 'bg-red-100 border-l-4 border-red-500' 
                          : session.type === 'review'
                          ? 'bg-blue-100 border-l-4 border-blue-500'
                          : 'bg-gray-100 border-l-4 border-gray-400'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{session.time}</span>
                      </div>
                      <div className="space-y-1">
                        {session.units.map(unit => (
                          <div key={unit.id} className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: unit.color }}
                            />
                            <span className="text-xs">{unit.name}</span>
                          </div>
                        ))}
                      </div>
                      {session.type === 'priority' && (
                        <div className="text-xs text-red-600 mt-1 font-medium">Priority Focus</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Timetable Legend:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border-l-2 border-red-500"></div>
              <span>Priority (Lagging Units)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 border-l-2 border-gray-400"></div>
              <span>Regular Study</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border-l-2 border-blue-500"></div>
              <span>Review Sessions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyTimetable;
