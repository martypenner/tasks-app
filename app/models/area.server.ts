import type { Area, User } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Area } from '@prisma/client';

export function getArea({
	id,
	userId,
}: Pick<Area, 'id'> & {
	userId: User['id'];
}) {
	return prisma.area.findFirst({
		where: { id, userId },
		include: { Project: true },
	});
}

export function getAreas({ userId }: { userId: User['id'] }) {
	return prisma.area.findMany({
		where: { userId, deleted: null },
		select: { id: true, title: true, createdAt: true, updatedAt: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getDeletedAreas({ userId }: { userId: User['id'] }) {
	return prisma.area.findMany({
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

export function createArea({
	title,
	userId,
}: Pick<Area, 'title'> & {
	userId: User['id'];
}) {
	return prisma.area.create({
		data: {
			title,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteArea({ id, userId }: { id: Area['id']; userId: User['id'] }) {
	return prisma.area.updateMany({
		where: { id, userId },
		data: {
			deleted: new Date(),
		},
	});
}
