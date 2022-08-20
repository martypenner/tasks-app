import type { Task, User } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Task } from '@prisma/client';

export function getTask({
	id,
	userId,
}: Pick<Task, 'id'> & {
	userId: User['id'];
}) {
	return prisma.task.findFirst({
		where: {
			id,
			userId,
		},
	});
}

export function getTaskListItems({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: { userId, deleted: null },
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getDeletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function createTask({
	notes,
	title,
	when,
	whenDate,
	userId,
}: Pick<Task, 'notes' | 'title' | 'when' | 'whenDate'> & {
	userId: User['id'];
}) {
	return prisma.task.create({
		data: {
			title,
			notes,
			when,
			whenDate,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteTask({ userId, ...task }: Task & { userId: User['id'] }) {
	return prisma.task.updateMany({
		where: { id: task.id, userId },
		data: {
			...task,
			deleted: new Date(),
		},
	});
}

export function permaDeleteAllDeletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.deleteMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
	});
}