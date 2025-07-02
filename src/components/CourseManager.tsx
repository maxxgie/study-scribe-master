
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Edit2, Upload } from 'lucide-react';
import { createNotification } from '@/utils/notificationUtils';
import CourseFileUpload from '@/components/CourseFileUpload';

const CourseManager = () => {
  const { user } = useAuth();
  const { courses, createCourse, updateCourse, deleteCourse } = useCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
    year: new Date().getFullYear(),
    credits: 3,
    instructor: '',
  });

  const handleSubmit = async () => {
    if (!courseForm.name || !courseForm.code) return;

    if (editingCourse) {
      await updateCourse({
        id: editingCourse.id,
        ...courseForm,
      });
    } else {
      await createCourse(courseForm);
      
      // Create notification for new course
      if (user?.id) {
        await createNotification(user.id, {
          title: 'Course Added',
          message: `"${courseForm.name} (${courseForm.code})" has been successfully added to your courses.`,
          type: 'success',
          related_table: 'courses',
        });
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setCourseForm({
      name: '',
      code: '',
      description: '',
      semester: '',
      year: new Date().getFullYear(),
      credits: 3,
      instructor: '',
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: any) => {
    setCourseForm({
      name: course.name,
      code: course.code,
      description: course.description || '',
      semester: course.semester || '',
      year: course.year || new Date().getFullYear(),
      credits: course.credits || 3,
      instructor: course.instructor || '',
    });
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Course Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => setEditingCourse(null)}>
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Introduction to Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={courseForm.code}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., CS101"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Course description (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={courseForm.semester}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, semester: e.target.value }))}
                    placeholder="e.g., Fall, Spring"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={courseForm.year}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="Instructor name"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedCourse ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setSelectedCourse(null)}>
              ← Back to Courses
            </Button>
            <h3 className="text-xl font-semibold">{selectedCourse.name}</h3>
          </div>
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Course Details</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCourse.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Code:</span> {selectedCourse.code}
                    </div>
                    <div>
                      <span className="font-medium">Credits:</span> {selectedCourse.credits}
                    </div>
                    {selectedCourse.instructor && (
                      <div>
                        <span className="font-medium">Instructor:</span> {selectedCourse.instructor}
                      </div>
                    )}
                    {selectedCourse.semester && selectedCourse.year && (
                      <div>
                        <span className="font-medium">Term:</span> {selectedCourse.semester} {selectedCourse.year}
                      </div>
                    )}
                  </div>
                  {selectedCourse.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="mt-1 text-muted-foreground">{selectedCourse.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="files">
              <CourseFileUpload courseId={selectedCourse.id} courseName={selectedCourse.name} />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by adding your first course
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          ) : (
            courses.map(course => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{course.code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCourse(course)}
                        title="View details and files"
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCourse(course.id)}
                        className="h-8 w-8 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.description && (
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Credits:</span>
                    <span className="font-medium">{course.credits}</span>
                  </div>
                  {course.instructor && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                  )}
                  {course.semester && course.year && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Term:</span>
                      <span className="font-medium">{course.semester} {course.year}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CourseManager;
