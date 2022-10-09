import { path } from 'static-path';

export const allTasks = path('/tasks');
export const task = allTasks.path(':taskId');
export const newTask = allTasks.path('new');
export const deleteTask = allTasks.path('delete');
export const updateTaskStatus = allTasks.path('update-status');

export const inbox = allTasks.path('inbox');
export const today = allTasks.path('today');
export const upcoming = allTasks.path('upcoming');
export const anytime = allTasks.path('anytime');
export const someday = allTasks.path('someday');
export const logbook = allTasks.path('logbook');
export const trash = allTasks.path('trash');

export const allProjects = path('/projects');
export const project = allProjects.path(':projectId');
export const newProject = allProjects.path('new');

export const allAreas = path('/areas');
export const area = allAreas.path(':areaId');
export const newArea = allAreas.path('new');
