
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useStudy } from '@/contexts/StudyContext';

const ProgressCharts = () => {
  const { units, getWeeklyProgress, sessions } = useStudy();
  const weeklyProgress = getWeeklyProgress();

  // Prepare data for bar chart
  const barData = units.map(unit => ({
    name: unit.name.split(' ').slice(0, 2).join(' '), // Shortened names
    progress: weeklyProgress[unit.id] || 0,
    goal: 100,
    color: unit.color
  }));

  // Prepare data for pie chart - total hours studied per unit
  const pieData = units.map(unit => ({
    name: unit.name.split(' ').slice(0, 2).join(' '),
    value: unit.totalHours,
    color: unit.color
  })).filter(item => item.value > 0);

  // Recent activity data
  const recentSessions = sessions
    .slice(-10)
    .reverse()
    .map(session => {
      const unit = units.find(u => u.id === session.unitId);
      return {
        unit: unit?.name || 'Unknown',
        duration: session.duration,
        date: session.date.toLocaleDateString(),
        color: unit?.color || '#gray'
      };
    });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Progress Bar Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']}
                labelFormatter={(label) => `Unit: ${label}`}
              />
              <Bar 
                dataKey="progress" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Total Hours Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Total Study Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${(value as number).toFixed(1)}h`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Study Time']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              No study data yet. Start logging your sessions!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {recentSessions.length > 0 ? recentSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: session.color }}
                  />
                  <span className="text-sm font-medium">{session.unit}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{session.duration}m</div>
                  <div className="text-xs text-muted-foreground">{session.date}</div>
                </div>
              </div>
            )) : (
              <div className="text-center text-muted-foreground py-8">
                No study sessions logged yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
