import { path } from 'static-path';

export const allTasks = path('/tasks');
export const inbox = allTasks.path('inbox');
export const task = allTasks.path(':taskId');
export const newTask = allTasks.path('new');

export const allProjects = path('/projects');
export const project = allProjects.path(':projectId');
export const newProject = allProjects.path('new');

export const allAreas = path('/areas');
export const area = allAreas.path(':areaId');
export const newArea = allAreas.path('new');
