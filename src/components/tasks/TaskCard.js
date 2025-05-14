import React from 'react';
import { format } from 'date-fns';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const priorityClasses = {
  low: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    badge: 'bg-green-100 text-green-800 ring-green-600/20'
  },
  medium: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20'
  },
  high: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    badge: 'bg-red-100 text-red-800 ring-red-600/20'
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { title, description, dueDate, priority, completed } = task;
  const priorityStyle = priorityClasses[priority];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={classNames(
        'border rounded-lg p-4 shadow-sm transform transition-all duration-200',
        completed ? 'bg-gray-50 border-gray-200' : priorityStyle.bg,
        'hover:shadow-lg'
      )}
    >
      <div className="flex items-center justify-between">
        <motion.h3
          layout="position"
          className={classNames(
            'text-lg font-medium transition-colors duration-200',
            completed ? 'text-gray-500 line-through' : priorityStyle.text
          )}
        >
          {title}
        </motion.h3>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className={classNames(
            'px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset transition-all duration-200',
            priorityStyle.badge
          )}
        >
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </motion.span>
      </div>

      <motion.p
        layout="position"
        className={classNames(
          'mt-2 text-sm transition-colors duration-200',
          completed ? 'text-gray-400 line-through' : 'text-gray-600'
        )}
      >
        {description}
      </motion.p>

      <motion.div
        layout="position"
        className="mt-4 flex items-center justify-between"
      >
        <div className={classNames(
          'text-sm font-medium',
          completed ? 'text-gray-400' : priorityStyle.text
        )}>
          Due: {format(new Date(dueDate), 'PPp')}
        </div>

        <div className="space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
            className="transform transition-transform duration-200 hover:scale-105 hover:shadow-md"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="transform transition-transform duration-200 hover:scale-105 hover:shadow-md"
          >
            Delete
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskCard; 