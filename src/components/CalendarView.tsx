import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, CalendarIcon } from 'lucide-react';
import { useAssignments } from '@/hooks/useAssignments';
import { format, isSameDay } from 'date-fns';

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { assignments } = useAssignments();

  // Get assignments for the selected date
  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.due_date), date)
    );
  };

  // Get dates that have assignments
  const getDatesWithAssignments = () => {
    return assignments.map(assignment => new Date(assignment.due_date));
  };

  const selectedDateAssignments = getAssignmentsForDate(selectedDate);
  const currentTime = new Date();

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Calendar & Schedule</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border p-3 pointer-events-auto"
              modifiers={{
                hasAssignment: getDatesWithAssignments()
              }}
              modifiersStyles={{
                hasAssignment: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Current Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                {format(currentTime, 'EEEE')}
              </div>
              <div className="text-2xl font-semibold">
                {format(currentTime, 'MMMM d, yyyy')}
              </div>
              <div className="text-xl text-muted-foreground">
                {format(currentTime, 'h:mm:ss a')}
              </div>
            </div>
            
            {/* Week Progress */}
            <div className="mt-6 p-4 bg-accent rounded-lg">
              <h4 className="font-medium mb-2">This Week</h4>
              <div className="text-sm text-muted-foreground">
                Week {Math.ceil((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))} of {new Date().getFullYear()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Assignments for {format(selectedDate, 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No assignments due on this date.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateAssignments.map(assignment => (
                <div 
                  key={assignment.id} 
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${assignment.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {assignment.title}
                      </h4>
                    </div>
                    {assignment.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityVariant(assignment.priority)}>
                      {assignment.priority}
                    </Badge>
                    {assignment.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;