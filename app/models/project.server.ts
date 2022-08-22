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
		select: { id: true, title: true, createdAt: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getDeletedProjects({ userId }: { userId: User['id'] }) {
	return prisma.project.findMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
			done: false,
		},
		select: { id: true, title: true, deleted: true },
		orderBy: { deleted: 'desc' },
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

export function deleteProject({ id, userId }: { id: Project['id']; userId: User['id'] }) {
	return prisma.project.updateMany({
		where: { id, userId },
		data: {
			deleted: new Date(),
		},
	});
}
