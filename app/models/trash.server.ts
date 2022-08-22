import { User } from '@prisma/client';

import { prisma } from '~/db.server';

export function permaDeleteAllDeletedItems({ userId }: { userId: User['id'] }) {
	return prisma.task.deleteMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
	});
}
