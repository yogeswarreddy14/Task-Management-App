import React from 'react';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './contexts/TaskContext';
import Dashboard from './components/layout/Dashboard';

function App() {
  return (
    <TaskProvider>
      <div>
        <Toaster position="top-right" />
        <Dashboard />
      </div>
    </TaskProvider>
  );
}

export default App;