import type { Heading, Project, Task } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Project } from '@prisma/client';

export function getProject({ id }: Pick<Project, 'id'>) {
	return prisma.project.findFirst({
		where: { id },
		include: {
			tasks: {
				include: {
					Heading: true,
				},
				orderBy: { globalOrder: 'desc' },
			},
			Headings: {
				orderBy: { globalOrder: 'desc' },
			},
		},
	});
}

export function getProjectsWithoutAreas() {
	return prisma.project.findMany({
		where: { areaId: null, deleted: null, completedDate: null },
		include: {
			tasks: {
				where: { deleted: null },
				orderBy: { globalOrder: 'desc' },
			},
		},
		orderBy: { globalOrder: 'desc' },
	});
}

export function getCompletedProjects() {
	return prisma.project.findMany({
		where: {
			deleted: null,
			completedDate: { not: null },
		},
		orderBy: { deleted: 'desc' },
	});
}

export function getDeletedProjects() {
	return prisma.project.findMany({
		where: {
			deleted: { not: null },
		},
		select: { id: true, title: true, deleted: true },
		orderBy: { deleted: 'desc' },
	});
}

export async function createProject({
	notes,
	title,
	when,
	whenDate,
}: Pick<Project, 'notes' | 'title' | 'when' | 'whenDate'> & {}) {
	const order = (await prisma.project.findFirst({
		where: { deleted: null },
		select: { globalOrder: true },
		orderBy: { globalOrder: 'desc' },
	})) ?? { globalOrder: BigInt(-1) };
	return prisma.project.create({
		data: {
			title,
			notes,
			when,
			whenDate,
			globalOrder: Number(order.globalOrder) + 1,
			// todo: add area
		},
	});
}

export async function deleteProject({ id }: { id: Project['id'] }) {
	await prisma.task.updateMany({
		where: { projectId: id },
		data: { deleted: new Date() },
	});
	return prisma.project.updateMany({
		where: { id },
		data: { deleted: new Date() },
	});
}

export async function toggleProjectComplete({
	id,

	completedDate,
	taskStatus = 'completed',
}: {
	id: Project['id'];
	completedDate: Project['completedDate'];
	taskStatus?: Task['status'];
}) {
	// Mark child tasks as done if we're marking the project as done.
	if (completedDate != null) {
		await prisma.task.updateMany({
			where: { projectId: id, status: 'in-progress' },
			data: { status: taskStatus, ...(taskStatus === 'completed' ? { completedDate } : {}) },
		});
		// Mark unarchived headings as arhived.
		await prisma.heading.updateMany({
			where: { projectId: id, archived: null },
			data: { archived: new Date() },
		});
	}
	return prisma.project.updateMany({
		where: { id },
		data: { completedDate },
	});
}

export async function convertHeadingToProject({ id }: { id: Heading['id'] }) {
	const heading = await prisma.heading.findFirstOrThrow({
		where: { id },
	});
	const project = await createProject({
		title: heading.title,
		notes: '',
		when: 'inbox',
		whenDate: null,
	});
	// Re-associate all of the heading tasks to the new project
	await prisma.task.updateMany({
		where: { headingId: heading.id },
		data: {
			headingId: null,
			projectId: project.id,
		},
	});
	await prisma.heading.deleteMany({
		where: { id: heading.id },
	});

	return project;
}

export async function archiveHeading({ id }: { id: Heading['id'] }) {
	return prisma.heading.updateMany({
		where: { id },
		data: { archived: new Date() },
	});
}
