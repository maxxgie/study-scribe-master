
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import StudyLogger from '@/components/StudyLogger';
import StudyAnalytics from '@/components/StudyAnalytics';
import ProgressCharts from '@/components/ProgressCharts';
import WeeklyTimetable from '@/components/WeeklyTimetable';
import NotificationCenter from '@/components/NotificationCenter';
import AssignmentTracker from '@/components/AssignmentTracker';
import CourseManager from '@/components/CourseManager';
import StudySessionsList from '@/components/StudySessionsList';
import UserSettings from '@/components/UserSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Calendar, TrendingUp, Clock, Bell, BookCheck, GraduationCap, Settings } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <StudyProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.user_metadata?.full_name || 'Student'}!
            </h2>
            <p className="text-lg text-gray-600">
              Track your progress, manage assignments, and optimize your study schedule
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="logger" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Log Study
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="timetable" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timetable
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <BookCheck className="h-4 w-4" />
                Assignments
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <StudyAnalytics />
            </TabsContent>

            <TabsContent value="logger" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <StudyLogger />
                </div>
                <div className="lg:col-span-2">
                  <StudySessionsList />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <ProgressCharts />
            </TabsContent>

            <TabsContent value="timetable" className="space-y-6">
              <WeeklyTimetable />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationCenter />
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <AssignmentTracker />
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <CourseManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <UserSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudyProvider>
  );
};

export default Index;
