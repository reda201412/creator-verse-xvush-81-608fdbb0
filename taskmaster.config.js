// Task Master Configuration
export default {
  // Project information
  projectName: 'Creator-Verse',

  // Task configuration
  tasks: {
    directory: './tasks',
    fileName: 'tasks.json',
  },

  // Task status options
  statuses: ['pending', 'in-progress', 'in-review', 'done', 'blocked'],

  // Priority levels
  priorities: ['high', 'medium', 'low'],

  // Task types
  types: ['feature', 'bug', 'chore', 'refactor', 'research'],

  // Default task template
  defaultTask: {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    type: 'feature',
    dependencies: [],
    subtasks: [],
    labels: [],
    assignee: null,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
