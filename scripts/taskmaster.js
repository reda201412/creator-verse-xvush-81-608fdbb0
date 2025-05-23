#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';

// Configuration
const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
  fs.writeFileSync(
    TASKS_FILE,
    JSON.stringify(
      {
        tasks: [],
        lastId: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

// Load tasks
function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  } catch (err) {
    console.error('Error loading tasks:', err.message);
    process.exit(1);
  }
}

// Save tasks
function saveTasks(tasks) {
  try {
    tasks.updatedAt = new Date().toISOString();
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (err) {
    console.error('Error saving tasks:', err.message);
    process.exit(1);
  }
}

// Setup CLI
program.name('taskmaster').description('CLI for managing tasks in Creator-Verse').version('0.1.0');

// List tasks
program
  .command('list')
  .description('List all tasks')
  .action(() => {
    const { tasks } = loadTasks();
    console.log('\n=== Tasks ===');
    tasks.forEach(task => {
      console.log(`[${task.id}] ${task.title} (${task.status})`);
      if (task.description) console.log(`   ${task.description}`);
    });
    console.log('=============\n');
  });

// Add task
program
  .command('add <title>')
  .description('Add a new task')
  .option('-d, --description <description>', 'Task description')
  .option('-p, --priority <priority>', 'Task priority (high, medium, low)', 'medium')
  .option('-s, --status <status>', 'Task status', 'pending')
  .action((title, options) => {
    const tasks = loadTasks();
    const newTask = {
      id: ++tasks.lastId,
      title,
      description: options.description || '',
      priority: options.priority,
      status: options.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.tasks.push(newTask);
    saveTasks(tasks);
    console.log(`\n✅ Added task #${newTask.id}: ${title}\n`);
  });

// Update task
program
  .command('update <id>')
  .description('Update a task')
  .option('-t, --title <title>', 'New title')
  .option('-d, --description <description>', 'New description')
  .option('-p, --priority <priority>', 'New priority')
  .option('-s, --status <status>', 'New status')
  .action((id, options) => {
    const tasks = loadTasks();
    const task = tasks.tasks.find(t => t.id === parseInt(id));
    if (!task) {
      console.error(`\n❌ Task #${id} not found\n`);
      process.exit(1);
    }

    if (options.title) task.title = options.title;
    if (options.description) task.description = options.description;
    if (options.priority) task.priority = options.priority;
    if (options.status) task.status = options.status;
    task.updatedAt = new Date().toISOString();

    saveTasks(tasks);
    console.log(`\n✅ Updated task #${id}\n`);
  });

// Complete task
program
  .command('complete <id>')
  .description('Mark a task as complete')
  .action(id => {
    const tasks = loadTasks();
    const task = tasks.tasks.find(t => t.id === parseInt(id));
    if (!task) {
      console.error(`\n❌ Task #${id} not found\n`);
      process.exit(1);
    }

    task.status = 'done';
    task.updatedAt = new Date().toISOString();
    saveTasks(tasks);
    console.log(`\n✅ Marked task #${id} as complete\n`);
  });

// Parse command line arguments
program.parse(process.argv);
