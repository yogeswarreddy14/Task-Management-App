import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTaskContext } from '../../contexts/TaskContext';

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(10, 'Too Short!')
    .max(200, 'Too Long!')
    .required('Required'),
  dueDate: Yup.date()
    .min(new Date(), 'Due date cannot be in the past')
    .required('Required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'], 'Invalid priority')
    .required('Required'),
  category: Yup.string()
    .oneOf(['work', 'personal', 'shopping', 'health', 'other'], 'Invalid category')
    .required('Required'),
  status: Yup.string()
    .oneOf(['not-started', 'in-progress', 'completed', 'on-hold'], 'Invalid status')
    .required('Required'),
  notes: Yup.string()
    .max(500, 'Notes too long')
    .nullable(),
  reminderDate: Yup.date()
    .min(new Date(), 'Reminder date cannot be in the past')
    .nullable()
});

const TaskForm = ({ onClose, initialValues, isEditing }) => {
  const { addTask, updateTask } = useTaskContext();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isEditing) {
        await updateTask(initialValues._id, values);
      } else {
        await addTask(values);
      }
      resetForm();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const defaultValues = {
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    category: 'other',
    status: 'not-started',
    notes: '',
    reminderDate: null
  };

  return (
    <Formik
      initialValues={initialValues || defaultValues}
      validationSchema={TaskSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
        <Form className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                  ${errors.title && touched.title 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              {errors.title && touched.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                  ${errors.description && touched.description 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
              />
              {errors.description && touched.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.category}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.category && touched.category 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
                {errors.category && touched.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.priority}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.priority && touched.priority 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && touched.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dueDate}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.dueDate && touched.dueDate 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                />
                {errors.dueDate && touched.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.status}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${errors.status && touched.status 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
                {errors.status && touched.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.notes || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Task'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm; 