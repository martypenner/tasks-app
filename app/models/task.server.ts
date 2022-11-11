import type { Task } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Task } from '@prisma/client';

export function getTask({ id }: Pick<Task, 'id'>) {
	return prisma.task.findFirst({
		where: {
			id,
		},
	});
}

export function getTaskListItemsByWhen({ when = 'inbox' }: { when?: Task['when'] }) {
	return prisma.task.findMany({
		where: {
			deleted: null,
			when,
			status: 'in-progress',
			projectId: null,
			areaId: null,
		},
		include: { project: true, heading: true },
		orderBy: { globalOrder: 'desc' },
	});
}

export function getCompletedTasks() {
	return prisma.task.findMany({
		where: {
			deleted: null,
			status: { not: 'in-progress' },
		},
		include: { project: true, heading: true },
		orderBy: { globalOrder: 'desc' },
	});
}

export function getDeletedTasks() {
	return prisma.task.findMany({
		where: {
			deleted: { not: null },
			// Get tasks that don't have a project or the project isn't done.
			OR: [{ project: { is: null } }, { project: { completedDate: null } }],
		},
		include: { project: true, heading: true },
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
}: Pick<Task, 'notes' | 'title' | 'when' | 'whenDate' | 'projectId' | 'areaId'>) {
	const order = (await prisma.task.findFirst({
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
						project: {
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
		},
	});
}

export function deleteTask({ id }: { id: Task['id'] }) {
	return prisma.task.updateMany({
		where: { id },
		data: { deleted: new Date() },
	});
}

export function updateTaskStatus({ id, status }: { id: Task['id']; status: Task['status'] }) {
	return prisma.task.updateMany({
		where: { id },
		data: {
			status,
			completedDate: status === 'in-progress' ? null : new Date(),
		},
	});
}
