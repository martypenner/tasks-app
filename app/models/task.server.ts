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

export function getTaskListItemsByWhen({ userId, when = 'inbox' }: { userId: User['id']; when?: Task['when'] }) {
	return prisma.task.findMany({
		where: {
			userId,
			deleted: null,
			when,
			done: false,
			projectId: null,
			areaId: null,
		},
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getCompletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: { userId, deleted: null, done: true },
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getDeletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: {
			userId,
			deleted: { not: null },
			projectId: null,
		},
		select: { id: true, title: true, deleted: true },
		orderBy: { deleted: 'desc' },
	});
}

export function createTask({
	notes,
	title,
	when,
	whenDate,
	projectId,
	areaId,
	userId,
}: Pick<Task, 'notes' | 'title' | 'when' | 'whenDate' | 'projectId' | 'areaId'> & {
	userId: User['id'];
}) {
	return prisma.task.create({
		data: {
			title,
			notes,
			when,
			whenDate,

			...(projectId == null
				? {}
				: {
						Project: {
							connect: {
								id: projectId,
							},
						},
				  }),

			...(areaId == null
				? {}
				: {
						Area: {
							connect: {
								id: areaId,
							},
						},
				  }),

			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteTask({ id, userId }: { id: Task['id']; userId: User['id'] }) {
	return prisma.task.updateMany({
		where: { id, userId },
		data: {
			deleted: new Date(),
		},
	});
}
