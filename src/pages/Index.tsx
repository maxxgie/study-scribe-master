
import React from 'react';
import { StudyProvider } from '@/contexts/StudyContext';
import StudyLogger from '@/components/StudyLogger';
import StudyAnalytics from '@/components/StudyAnalytics';
import ProgressCharts from '@/components/ProgressCharts';
import WeeklyTimetable from '@/components/WeeklyTimetable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Calendar, TrendingUp, Clock } from 'lucide-react';

const Index = () => {
  return (
    <StudyProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Smart Study Planner
            </h1>
            <p className="text-lg text-gray-600">
              Track your progress, analyze patterns, and optimize your study schedule
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
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
                  <ProgressCharts />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <ProgressCharts />
            </TabsContent>

            <TabsContent value="timetable" className="space-y-6">
              <WeeklyTimetable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudyProvider>
  );
};

export default Index;
