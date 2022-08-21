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
		include: { tasks: true },
	});
}

export function getProjects({ userId }: { userId: User['id'] }) {
	return prisma.project.findMany({
		where: { userId, deleted: null, done: false },
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function createProject({
	notes,
	title,
	when,
	whenDate,
	userId,
}: Pick<Project, 'notes' | 'title' | 'when' | 'whenDate'> & {
	userId: User['id'];
}) {
	return prisma.project.create({
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

export function deleteProject({ userId, ...project }: Project & { userId: User['id'] }) {
	return prisma.project.updateMany({
		where: { id: project.id, userId },
		data: {
			...project,
			deleted: new Date(),
		},
	});
}
