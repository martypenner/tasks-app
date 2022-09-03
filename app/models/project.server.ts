import type { Project, User } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Project } from '@prisma/client';

export function getProject({
	id,
	userId,
}: Pick<Project, 'id'> & {
	userId: User['id'];
}) {
	return prisma.project.findFirst({
		where: { id, userId },
		include: {
			tasks: {
				where: { deleted: null, done: false },
				include: {
					Heading: true,
				},
				orderBy: { globalOrder: 'desc' },
			},
			Headings: {
				orderBy: { globalOrder: 'desc' },
			},
		},
	});
}

export function getProjects({ userId }: { userId: User['id'] }) {
	return prisma.project.findMany({
		where: { userId, deleted: null, done: false },
		select: { id: true, title: true, createdAt: true, updatedAt: true },
		orderBy: { globalOrder: 'desc' },
	});
}

export function getDeletedProjects({ userId }: { userId: User['id'] }) {
	return prisma.project.findMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
		select: { id: true, title: true, deleted: true },
		orderBy: { deleted: 'desc' },
	});
}

export async function createProject({
	notes,
	title,
	when,
	whenDate,
	userId,
}: Pick<Project, 'notes' | 'title' | 'when' | 'whenDate'> & {
	userId: User['id'];
}) {
	const order = (await prisma.project.findFirst({
		where: { userId, deleted: null },
		select: { globalOrder: true },
		orderBy: { globalOrder: 'desc' },
	})) ?? { globalOrder: BigInt(-1) };
	return prisma.project.create({
		data: {
			title,
			notes,
			when,
			whenDate,
			globalOrder: Number(order.globalOrder) + 1,
			// todo: add area
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteProject({ id, userId }: { id: Project['id']; userId: User['id'] }) {
	return prisma.project.updateMany({
		where: { id, userId },
		data: {
			deleted: new Date(),
		},
	});
}
