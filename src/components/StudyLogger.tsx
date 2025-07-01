
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStudy } from '@/contexts/StudyContext';
import { Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';

const StudyLogger = () => {
  const { units, addStudySession } = useStudy();
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUnit || !duration) {
      toast.error('Please select a unit and enter duration');
      return;
    }

    const durationNum = parseInt(duration);
    if (durationNum <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }

    addStudySession(parseInt(selectedUnit), durationNum, notes || undefined);
    
    const unitName = units.find(u => u.id === parseInt(selectedUnit))?.name;
    toast.success(`Logged ${durationNum} minutes for ${unitName}`);
    
    // Reset form
    setSelectedUnit('');
    setDuration('');
    setNotes('');
  };

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
            <label className="text-sm font-medium mb-2 block">Unit</label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit to study" />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit.id} value={unit.id.toString()}>
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
            <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
            <Input
              type="number"
              placeholder="e.g., 60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
            <Textarea
              placeholder="What did you study? Any key insights?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Log Study Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudyLogger;
