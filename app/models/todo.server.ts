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
		where: {
			id,
			userId,
		},
	});
}

export function getTodoListItems({ userId }: { userId: User['id'] }) {
	return prisma.todo.findMany({
		where: { userId, deleted: null },
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function getDeletedTodos({ userId }: { userId: User['id'] }) {
	return prisma.todo.findMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
		select: { id: true, title: true },
		orderBy: { updatedAt: 'desc' },
	});
}

export function createTodo({
	notes,
	title,
	when,
	whenDate,
	userId,
}: Pick<Todo, 'notes' | 'title' | 'when' | 'whenDate'> & {
	userId: User['id'];
}) {
	return prisma.todo.create({
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

export function deleteTodo({ userId, ...todo }: Todo & { userId: User['id'] }) {
	return prisma.todo.updateMany({
		where: { id: todo.id, userId },
		data: {
			...todo,
			deleted: new Date(),
		},
	});
}

export function permaDeleteAllDeletedTodos({ userId }: { userId: User['id'] }) {
	return prisma.todo.deleteMany({
		where: {
			userId,
			deleted: {
				not: null,
			},
		},
	});
}
