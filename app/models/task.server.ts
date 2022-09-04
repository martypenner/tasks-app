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
			status: 'in-progress',
			projectId: null,
			areaId: null,
		},
		select: { id: true, title: true },
		orderBy: { globalOrder: 'desc' },
	});
}

export function getCompletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: {
			userId,
			deleted: null,
			status: { not: 'in-progress' },
		},
		include: { Project: true },
		orderBy: { globalOrder: 'desc' },
	});
}

export function getDeletedTasks({ userId }: { userId: User['id'] }) {
	return prisma.task.findMany({
		where: {
			userId,
			deleted: { not: null },
			// Get tasks that don't have a project or the project isn't done.
			OR: [{ Project: { is: null } }, { Project: { done: false } }],
		},
		include: { Project: true },
		orderBy: { deleted: 'desc' },
	});
}

export async function createTask({
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
	const order = (await prisma.task.findFirst({
		where: { userId },
		select: { globalOrder: true },
		orderBy: { globalOrder: 'desc' },
	})) ?? { globalOrder: BigInt(-1) };
	return prisma.task.create({
		data: {
			title,
			notes,
			when,
			whenDate,
			globalOrder: Number(order.globalOrder) + 1,

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
		data: { deleted: new Date() },
	});
}

export function updateTaskStatus({
	id,
	userId,
	status,
}: {
	id: Task['id'];
	userId: User['id'];
	status: Task['status'];
}) {
	return prisma.task.updateMany({
		where: { id, userId },
		data: { status },
	});
}
