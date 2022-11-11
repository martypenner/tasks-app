import { prisma } from '~/db.server';

export function permaDeleteAllDeletedItems() {
	return Promise.all([
		prisma.task.deleteMany({
			where: {
				deleted: {
					not: null,
				},
			},
		}),
		prisma.project.deleteMany({
			where: {
				deleted: {
					not: null,
				},
			},
		}),
	]);
}
