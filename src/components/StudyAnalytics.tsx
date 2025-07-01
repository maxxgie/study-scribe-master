
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStudy } from '@/contexts/StudyContext';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

const StudyAnalytics = () => {
  const { units, getWeeklyProgress, getLaggingUnits, getStudySuggestions, currentWeek } = useStudy();
  const weeklyProgress = getWeeklyProgress();
  const laggingUnits = getLaggingUnits();
  const suggestions = getStudySuggestions();

  // Calculate overall metrics
  const totalWeeklyHours = Object.values(weeklyProgress).reduce((sum, progress) => {
    const unit = units.find(u => weeklyProgress[u.id] === progress);
    return sum + ((progress / 100) * (unit?.weeklyGoal || 0));
  }, 0);

  const averageProgress = Object.values(weeklyProgress).reduce((sum, progress) => sum + progress, 0) / units.length;

  // Get semester phase
  const getSemesterPhase = () => {
    if (currentWeek <= 4) return { phase: 'Early Semester', color: 'bg-green-100 text-green-800' };
    if (currentWeek === 5) return { phase: 'CAT Week 1', color: 'bg-red-100 text-red-800' };
    if (currentWeek <= 7) return { phase: 'Mid Semester', color: 'bg-yellow-100 text-yellow-800' };
    if (currentWeek === 8) return { phase: 'CAT Week 2', color: 'bg-red-100 text-red-800' };
    if (currentWeek <= 10) return { phase: 'Late Semester', color: 'bg-orange-100 text-orange-800' };
    return { phase: 'Exam Period', color: 'bg-purple-100 text-purple-800' };
  };

  const semesterPhase = getSemesterPhase();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Week {currentWeek}</p>
                <Badge className={semesterPhase.color}>{semesterPhase.phase}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Weekly Hours</p>
                <p className="text-2xl font-bold">{totalWeeklyHours.toFixed(1)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{averageProgress.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lagging Units</p>
                <p className="text-2xl font-bold">{laggingUnits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Progress Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Unit Progress This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {units.map(unit => {
              const progress = weeklyProgress[unit.id] || 0;
              const isLagging = progress < 50;
              
              return (
                <div key={unit.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: unit.color }}
                      />
                      <span className="font-medium">{unit.name}</span>
                      {isLagging && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {progress.toFixed(0)}% of {unit.weeklyGoal}h goal
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                    style={{
                      '--progress-background': unit.color
                    } as any}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Smart Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">{suggestion}</p>
              </div>
            ))}
            
            {laggingUnits.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800 mb-2">Priority Units:</p>
                <div className="flex flex-wrap gap-2">
                  {laggingUnits.slice(0, 3).map(unit => (
                    <Badge key={unit.id} variant="destructive" className="text-xs">
                      {unit.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyAnalytics;
