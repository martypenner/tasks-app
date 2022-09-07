import type { User } from '@prisma/client';

import { prisma } from '~/db.server';

export function permaDeleteAllDeletedItems({ userId }: { userId: User['id'] }) {
	return Promise.all([
		prisma.task.deleteMany({
			where: {
				userId,
				deleted: {
					not: null,
				},
			},
		}),
		prisma.project.deleteMany({
			where: {
				userId,
				deleted: {
					not: null,
				},
			},
		}),
	]);
}
