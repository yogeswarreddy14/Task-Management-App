import React, { useState } from 'react';
import Navbar from './Navbar';
import TaskList from '../tasks/TaskList';
import TaskStats from '../tasks/TaskStats';
import TaskForm from '../tasks/TaskForm';
import { useTaskContext } from '../../contexts/TaskContext';

const Calendar = ({ tasks, onAddTask }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = [];
    
    // Add days from previous month to start on Sunday
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const paddingDate = new Date(year, month, -i);
      daysInMonth.push(paddingDate);
    }
    
    // Add days of current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysInMonth.push(new Date(year, month, day));
    }
    
    // Add days from next month to complete the grid
    const endPadding = 42 - daysInMonth.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      daysInMonth.push(new Date(year, month + 1, i));
    }
    
    return daysInMonth;
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => 
      new Date(task.dueDate).toDateString() === date.toDateString()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-medium text-gray-900">{formatMonth(currentMonth)}</h2>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {getDaysInMonth(currentMonth).map((date, index) => {
            const tasksForDate = getTasksForDate(date);
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            
            return (
              <div 
                key={index}
                className={`bg-white p-2 min-h-[100px] ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday(date) ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium ${
                  isToday(date) ? 'text-blue-600' : 
                  !isCurrentMonth ? 'text-gray-400' :
                  'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>
                {tasksForDate.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {tasksForDate.map(task => (
                      <div
                        key={task._id}
                        className={`text-xs p-1 rounded truncate ${
                          task.completed 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { tasks } = useTaskContext();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Activity Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  ) : (
                    tasks.slice(0, 3).map(task => (
                      <div key={task._id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.completed ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">{task.title}</p>
                          <p className="text-xs text-gray-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Task Progress Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Progress</h3>
                <TaskStats tasks={tasks} />
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => setCurrentView('tasks')}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    View All Tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <TaskList />;
      case 'new-task':
        return (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="sr-only">Back to Dashboard</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TaskForm onClose={() => setCurrentView('dashboard')} />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <Calendar 
            tasks={tasks} 
            onAddTask={() => setCurrentView('new-task')} 
          />
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
            <TaskStats tasks={tasks} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setCurrentView('new-task')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>
        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard; 