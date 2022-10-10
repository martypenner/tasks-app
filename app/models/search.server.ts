import type { Heading } from '@prisma/client';
import { prisma } from '~/db.server';
import type { Area } from './area.server';
import type { Project } from './project.server';
import type { Task } from './task.server';
import type { User } from './user.server';

export async function search({ query, userId }: { query: string; userId: User['id'] }) {
	let results: {
		tasks: Task[];
		projects: Project[];
		areas: Area[];
		headings: Heading[];
	} = {
		tasks: await prisma.task.findMany({
			where: {
				OR: [{ title: { contains: query } }, { notes: { contains: query } }],
				userId,
			},
			orderBy: { globalOrder: 'desc' },
		}),
		projects: await prisma.project.findMany({
			where: {
				OR: [{ title: { contains: query } }, { notes: { contains: query } }],
				userId,
			},
			orderBy: { globalOrder: 'desc' },
		}),
		areas: await prisma.area.findMany({
			where: {
				title: { contains: query },
				userId,
			},
			orderBy: { globalOrder: 'desc' },
		}),
		headings: await prisma.heading.findMany({
			where: {
				title: { contains: query },
				userId,
			},
			orderBy: { globalOrder: 'desc' },
		}),
	};

	return results;
}
