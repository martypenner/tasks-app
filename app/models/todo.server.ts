import type { Todo, User } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Todo } from '@prisma/client';

export function getTodo({
	id,
	userId,
}: Pick<Todo, 'id'> & {
	userId: User['id'];
}) {
	return prisma.todo.findFirst({
		select: { id: true, body: true, title: true },
		where: { id, userId },
	});
}

export function getTodoListItems({ userId }: { userId: User['id'] }) {
	return prisma.todo.findMany({
		where: { userId },
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function createTodo({
	body,
	title,
	userId,
}: Pick<Todo, 'body' | 'title'> & {
	userId: User['id'];
}) {
	return prisma.todo.create({
		data: {
			title,
			body,
			user: {
				connect: {
					id: userId,
				},
			},
		},
	});
}

export function deleteTodo({ id, userId }: Pick<Todo, 'id'> & { userId: User['id'] }) {
	return prisma.todo.deleteMany({
		where: { id, userId },
	});
}
