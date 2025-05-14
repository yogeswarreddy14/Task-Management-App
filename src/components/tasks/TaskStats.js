import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`bg-white rounded-lg shadow p-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-10')}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const TaskStats = ({ tasks }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed).length;
  const upcomingTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek && !task.completed;
  }).length;

  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate tasks by priority
  const priorityStats = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  // Calculate tasks by category
  const categoryStats = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          color="border-l-4 border-blue-500"
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={`${completionRate}%`}
          color="border-l-4 border-green-500"
          icon={
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          color="border-l-4 border-red-500"
          icon={
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Due This Week"
          value={upcomingTasks}
          color="border-l-4 border-yellow-500"
          icon={
            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Priority and Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Priority Distribution</h3>
          <div className="space-y-2">
            {Object.entries(priorityStats).map(([priority, count]) => (
              <div key={priority} className="flex items-center">
                <span className="w-20 text-sm text-gray-600">{priority}</span>
                <div className="flex-1 ml-2">
                  <div className="h-2 rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalTasks) * 100}%` }}
                      className={`h-full rounded-full ${
                        priority === 'high' ? 'bg-red-500' :
                        priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Category Distribution</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center">
                <span className="w-20 text-sm text-gray-600">{category}</span>
                <div className="flex-1 ml-2">
                  <div className="h-2 rounded-full bg-gray-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalTasks) * 100}%` }}
                      className="h-full rounded-full bg-blue-500"
                    />
                  </div>
                </div>
                <span className="ml-2 text-sm text-gray-600">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats; 