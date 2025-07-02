import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudy } from '@/contexts/StudyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const StudySessionsList = () => {
  const { user } = useAuth();
  const { sessions, units, deleteStudySession } = useStudy();

  const getUnitName = (courseId: string) => {
    return units.find(u => u.id === courseId)?.name || 'Unknown Course';
  };

  const getUnitColor = (courseId: string) => {
    return units.find(u => u.id === courseId)?.color || '#3B82F6';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Study Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No study sessions yet. Start logging your study time to see them here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Study Sessions ({sessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.slice(0, 10).map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-card"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getUnitColor(session.courseId) }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{getUnitName(session.courseId)}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(session.duration)}
                  </span>
                </div>
                {session.subtopic && (
                  <p className="text-sm text-muted-foreground">{session.subtopic}</p>
                )}
                {session.notes && (
                  <p className="text-sm text-muted-foreground italic">{session.notes}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(session.date, { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.confidence_rating && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Confidence:</span>
                  <span className="text-sm font-medium">{session.confidence_rating}/5</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteStudySession(session.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StudySessionsList;