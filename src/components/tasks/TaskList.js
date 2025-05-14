import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskContext } from '../../contexts/TaskContext';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskStats from './TaskStats';

const TaskList = () => {
  const { tasks, loading, error, deleteTask, toggleTaskCompletion } = useTaskContext();
  const [editingTask, setEditingTask] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all',
    dueDate: 'all'
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [groupBy, setGroupBy] = useState('none');

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.dueDate !== 'all') {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      filtered = filtered.filter(task => {
        const dueDate = new Date(task.dueDate);
        switch (filters.dueDate) {
          case 'today':
            return dueDate.toDateString() === today.toDateString();
          case 'week':
            return dueDate <= nextWeek && dueDate >= today;
          case 'month':
            return dueDate <= nextMonth && dueDate >= today;
          case 'overdue':
            return dueDate < today && !task.completed;
          default:
            return true;
        }
      });
    }

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return a.status.localeCompare(b.status);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tasks, filters, sortBy]);

  const groupedTasks = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Tasks': filteredAndSortedTasks };
    }

    return filteredAndSortedTasks.reduce((groups, task) => {
      const key = task[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
      return groups;
    }, {});
  }, [filteredAndSortedTasks, groupBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskCompletion(taskId);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Tasks</h2>
        <div className="flex space-x-4">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="none">No Grouping</option>
            <option value="category">Group by Category</option>
            <option value="priority">Group by Priority</option>
            <option value="status">Group by Status</option>
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Task
          </button>
        </div>
      </div>

      <TaskStats tasks={tasks} />

      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <TaskForm
              onClose={() => setShowAddForm(false)}
              isEditing={false}
            />
          </motion.div>
        )}

        {editingTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <TaskForm
              initialValues={editingTask}
              onClose={() => setEditingTask(null)}
              isEditing={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {Object.entries(groupedTasks).map(([group, groupTasks]) => (
        <div key={group} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{group}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupTasks.map((task) => (
              <motion.div
                key={task._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-white rounded-lg shadow p-6 ${
                  task.completed ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className={`text-lg font-medium ${
                      task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      task.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p
                  className={`text-sm mb-4 ${
                    task.completed ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {task.category}
                  </span>
                  {task.tags && task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleComplete(task._id)}
                      className={`p-1 rounded-full ${
                        task.completed
                          ? 'text-green-600 hover:text-green-700'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-blue-600 hover:text-blue-700 rounded-full"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1 text-red-600 hover:text-red-700 rounded-full"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {filteredAndSortedTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found. Add a new task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList; 