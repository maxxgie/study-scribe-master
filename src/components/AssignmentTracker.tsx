
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAssignments } from '@/hooks/useAssignments';
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, CheckCircle, Clock, AlertTriangle, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { createNotification } from '@/utils/notificationUtils';
import AssignmentFileUpload from './AssignmentFileUpload';

const AssignmentTracker = () => {
  const { user } = useAuth();
  const { assignments, upcomingAssignments, overDueAssignments, createAssignment, updateAssignment, deleteAssignment } = useAssignments();
  const { courses } = useCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    course_id: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: '',
  });

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !selectedDate) return;

    const courseName = courses.find(c => c.id === newAssignment.course_id)?.name || 'Unknown Course';
    
    await createAssignment({
      ...newAssignment,
      due_date: selectedDate.toISOString(),
      completed: false,
    });

    // Create notification for new assignment
    if (user?.id) {
      await createNotification(user.id, {
        title: 'Assignment Created',
        message: `"${newAssignment.title}" for ${courseName} has been added to your assignments.`,
        type: 'info',
        related_table: 'assignments',
      });
    }

    setNewAssignment({
      title: '',
      description: '',
      course_id: '',
      priority: 'medium',
      due_date: '',
    });
    setSelectedDate(undefined);
    setIsDialogOpen(false);
  };

  const toggleAssignmentStatus = async (assignment: any) => {
    const wasCompleted = assignment.completed;
    
    await updateAssignment({
      id: assignment.id,
      completed: !assignment.completed,
    });

    // Create notification when assignment is completed
    if (!wasCompleted && user?.id) {
      await createNotification(user.id, {
        title: 'Assignment Completed!',
        message: `Great job! You've completed "${assignment.title}".`,
        type: 'success',
        related_table: 'assignments',
        related_id: assignment.id,
      });
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return `Overdue by ${Math.abs(diffInDays)} days`;
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  };

  const AssignmentCard = ({ assignment, variant = 'default' }: { assignment: any; variant?: 'default' | 'overdue' | 'completed' }) => {
    const getCardStyles = () => {
      switch (variant) {
        case 'overdue': return 'bg-destructive/5 border-destructive/20';
        case 'completed': return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30';
        default: return 'bg-card';
      }
    };

    return (
      <div className={`flex items-center justify-between p-3 border rounded-lg ${getCardStyles()}`}>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleAssignmentStatus(assignment)}
            className={`${assignment.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className={`font-medium ${assignment.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {assignment.title}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAssignmentId(selectedAssignmentId === assignment.id ? null : assignment.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                📎
              </Button>
            </div>
            <p className={`text-sm ${variant === 'overdue' ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
              {formatDueDate(assignment.due_date)}
            </p>
            {assignment.description && (
              <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
            )}
            {selectedAssignmentId === assignment.id && (
              <div className="mt-3 p-3 border rounded-lg bg-accent/50">
                <AssignmentFileUpload assignmentId={assignment.id} />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityVariant(assignment.priority)}>
            {assignment.priority}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteAssignment(assignment.id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            ×
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Assignment Tracker</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Assignment description (optional)"
                />
              </div>
              <div>
                <Label>Course</Label>
                <Select
                  value={newAssignment.course_id}
                  onValueChange={(value) => setNewAssignment(prev => ({ ...prev, course_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={newAssignment.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setNewAssignment(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCreateAssignment} className="w-full">
                Create Assignment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overdue Assignments */}
      {overDueAssignments.length > 0 && (
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Overdue Assignments ({overDueAssignments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overDueAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} variant="overdue" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Assignments ({upcomingAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingAssignments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No upcoming assignments. Great job staying on top of things!
            </p>
          ) : (
            upcomingAssignments.map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} variant="default" />
            ))
          )}
        </CardContent>
      </Card>

      {/* Completed Assignments */}
      {assignments.filter(a => a.completed).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              Completed Assignments ({assignments.filter(a => a.completed).length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.filter(a => a.completed).map(assignment => (
              <AssignmentCard key={assignment.id} assignment={assignment} variant="completed" />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignmentTracker;
