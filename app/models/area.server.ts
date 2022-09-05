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
		include: {
			Project: {
				where: { deleted: null, completedDate: null },
			},
			tasks: {
				where: { deleted: null, status: 'in-progress' },
				orderBy: { createdAt: 'desc' },
			},
		},
	});
}

export function getAreas({ userId }: { userId: User['id'] }) {
	return prisma.area.findMany({
		where: { userId, deleted: null },
		include: {
			Project: {
				where: { deleted: null, completedDate: null },
				include: {
					tasks: { orderBy: { globalOrder: 'desc' } },
				},
			},
		},
		orderBy: { globalOrder: 'desc' },
	});
}

export async function createArea({
	title,
	userId,
}: Pick<Area, 'title'> & {
	userId: User['id'];
}) {
	const order = (await prisma.area.findFirst({
		where: { userId, deleted: null },
		select: { globalOrder: true },
		orderBy: { globalOrder: 'desc' },
	})) ?? { globalOrder: BigInt(-1) };
	return prisma.area.create({
		data: {
			title,
			globalOrder: Number(order.globalOrder) + 1,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

// Areas are perma-deleted immediately, but their associated tasks and projects
// (and tasks within those projects) are soft-deleted.
export async function deleteArea({ id, userId }: { id: Area['id']; userId: User['id'] }) {
	// By soft-deleting projects first, we can soft-delete all tasks which are
	// tied to a soft-deleted project instead of querying some deep relation by ID
	// and soft-deleting that.
	await prisma.project.updateMany({
		where: { userId, areaId: id },
		data: {
			deleted: new Date(),
		},
	});
	await prisma.task.updateMany({
		where: {
			userId,
			OR: [
				{
					Project: {
						deleted: { not: null },
					},
				},
				{ areaId: id },
			],
		},
		data: {
			deleted: new Date(),
		},
	});
	return prisma.area.deleteMany({
		where: { id, userId },
	});
}
