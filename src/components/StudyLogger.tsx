
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStudy } from '@/contexts/StudyContext';
import { Clock, Plus, Star } from 'lucide-react';
import { createNotification } from '@/utils/notificationUtils';

const StudyLogger = () => {
  const { user } = useAuth();
  const { units, addStudySession, loading } = useStudy();
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [subtopic, setSubtopic] = useState<string>('');
  const [confidenceRating, setConfidenceRating] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUnit || !duration) {
      return;
    }

    const durationNum = parseInt(duration);
    if (durationNum <= 0) {
      return;
    }

    setSubmitting(true);
    
    const selectedUnitData = units.find(u => u.id === selectedUnit);
    const unitName = selectedUnitData?.name || 'Unknown Unit';
    
    await addStudySession(
      selectedUnit, // No need to parse as int since it's now a string UUID
      durationNum, 
      notes || undefined,
      subtopic || undefined,
      confidenceRating ? parseInt(confidenceRating) : undefined
    );
    
    // Create notification for study milestone achievements
    if (user?.id) {
      let notificationMessage = `You just completed a ${durationNum}-minute study session`;
      if (unitName !== 'Unknown Unit') {
        notificationMessage += ` for ${unitName}`;
      }
      if (subtopic) {
        notificationMessage += ` focusing on ${subtopic}`;
      }
      notificationMessage += '.';

      // Different notification types based on duration
      let notificationType: 'info' | 'success' = 'info';
      if (durationNum >= 120) { // 2 hours or more
        notificationType = 'success';
        notificationMessage += ' Great dedication!';
      } else if (durationNum >= 60) { // 1 hour or more
        notificationMessage += ' Keep up the good work!';
      }

      await createNotification(user.id, {
        title: 'Study Session Completed',
        message: notificationMessage,
        type: notificationType,
        related_table: 'study_sessions',
      });
    }
    
    // Reset form
    setSelectedUnit('');
    setDuration('');
    setNotes('');
    setSubtopic('');
    setConfidenceRating('');
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Log Study Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Unit</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit to study" />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: unit.color }}
                      />
                      {unit.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Duration (minutes)</Label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Subtopic (optional)</Label>
            <Input
              type="text"
              placeholder="e.g., Binary operations, SQL queries"
              value={subtopic}
              onChange={(e) => setSubtopic(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Confidence Rating (optional)</Label>
            <Select value={confidenceRating} onValueChange={setConfidenceRating}>
              <SelectTrigger>
                <SelectValue placeholder="How confident do you feel?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>1 - Need more practice</span>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>2 - Getting there</span>
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>3 - Comfortable</span>
                  </div>
                </SelectItem>
                <SelectItem value="4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>4 - Very confident</span>
                  </div>
                </SelectItem>
                <SelectItem value="5">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>5 - Mastered it!</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Notes (optional)</Label>
            <Textarea
              placeholder="What did you study? Any key insights?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            <Plus className="h-4 w-4 mr-2" />
            {submitting ? 'Logging...' : 'Log Study Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyLogger;
