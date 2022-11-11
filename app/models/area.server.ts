import type { Area } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Area } from '@prisma/client';

export function getArea({ id }: Pick<Area, 'id'>) {
	return prisma.area.findFirst({
		where: { id },
		include: {
			project: {
				where: { deleted: null, completedDate: null },
			},
			tasks: {
				where: { deleted: null },
				orderBy: { createdAt: 'desc' },
			},
		},
	});
}

export function getAreas() {
	return prisma.area.findMany({
		where: { deleted: null },
		include: {
			project: {
				where: { deleted: null, completedDate: null },
				include: {
					tasks: { orderBy: { globalOrder: 'desc' } },
				},
			},
		},
		orderBy: { globalOrder: 'desc' },
	});
}

export async function createArea({ title }: Pick<Area, 'title'>) {
	const order = (await prisma.area.findFirst({
		where: { deleted: null },
		select: { globalOrder: true },
		orderBy: { globalOrder: 'desc' },
	})) ?? { globalOrder: BigInt(-1) };
	return prisma.area.create({
		data: {
			title,
			globalOrder: Number(order.globalOrder) + 1,
		},
	});
}

// Areas are perma-deleted immediately, but their associated tasks and projects
// (and tasks within those projects) are soft-deleted.
export async function deleteArea({ id }: { id: Area['id'] }) {
	// By soft-deleting projects first, we can soft-delete all tasks which are
	// tied to a soft-deleted project instead of querying some deep relation by ID
	// and soft-deleting that.
	await prisma.project.updateMany({
		where: { areaId: id },
		data: {
			deleted: new Date(),
		},
	});
	await prisma.task.updateMany({
		where: {
			OR: [
				{
					project: {
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
		where: { id },
	});
}
